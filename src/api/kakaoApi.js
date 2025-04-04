import axios from "axios";
import { API_SERVER_POST } from "./todoApi";

const res_api_key = 'bf85d7f19edd7b106c6b559eabb4e0ca';
const redirect_uri = 'http://localhost:3000/member/kakao';
const host = `${API_SERVER_POST}/api/member`;

export const getKakaoLoginLink = ()=> {
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${res_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    return kakaoURL;
}


export const getAccessToken = async(authCode)=>{
    const header = {headers : {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}};
    const params = {
        grant_type : 'authorization_code',
        client_id :res_api_key,
        redirect_uri : redirect_uri,
        code : authCode
    }

    const res = await axios.post('https://kauth.kakao.com/oauth/token' , params , header);
    const accessToken = res.data.access_token;

    return accessToken;

}

export const getMemberWithAccessToken = async(accessToken)=>{
    const res = await axios.get(`${host}/kakao?accessToken=${accessToken}`);

    return res.data;
}