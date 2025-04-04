import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_POST } from "../api/todoApi";

const jwtAxios = axios.create();
const refeshJWT = async(accessToken , refreshToken)=>{
    const host = API_SERVER_POST;
    const header = {headers:{'Authorization':`Bearer ${accessToken}`}};

    console.log(`${host}/api/member/refresh?refreshToken=${refreshToken}`);

    const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}` , header);
    //console.log(res.data);

    return res.data;

    
}

const beforeReq = (config)=>{
    console.log("before request.............")

    const memberInfo = getCookie("member")

  
    if( !memberInfo ) {
        console.log("Member NOT FOUND")
        return Promise.reject(
            {response:
                {data:
                {error:"REQUIRE_LOGIN"}
                }
            }
        )
    }

    const {accessToken} = memberInfo;

    // Authorization 헤더 처리 
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config
}

const requestFail = (err)=>{
    return Promise.reject(err);
}

const beforeRes = async(res)=>{
    console.log('-----------beforeRes');
    const data = res.data;
    if(data && data.error === "ERROR_ACCESS_TOKEN"){
        console.log('-----------beforeRes -> ERROR_ACCESS_TOKEN');

        const memberCookieValue = getCookie('member');
        console.log(memberCookieValue);

        const result = await refeshJWT(memberCookieValue.accessToken , memberCookieValue.refreshToken);

        //새로운 accessToken 을 받는다
        memberCookieValue.accessToken = result.accessToken;
        memberCookieValue.refreshToken = result.refreshToken;

        setCookie('member' , JSON.stringify(memberCookieValue) , 1);

        //request 를 다시 보낸다
        const originalRequest = res.config;
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

        return await axios(originalRequest);
    }
    return res;
}

const responseFail = (err)=>{
    console.log('---------------responseFail');
    return Promise.reject(err);
}

jwtAxios.interceptors.request.use(beforeReq,requestFail);
jwtAxios.interceptors.response.use(beforeRes , responseFail);

export default jwtAxios;