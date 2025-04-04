import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import {login} from "../../slices/loginSlice"
import useCustomLogin from "../../hooks/useCustomLogin";

function KakaoRedirecPage(props){

    const [searchParams] = useSearchParams();

    const authCode = searchParams.get('code');
    const {moveToPath , saveAsCookie} = useCustomLogin();

    const dispatch = useDispatch();

    useEffect(()=>{
        getAccessToken(authCode).then(accessToken =>{
            getMemberWithAccessToken(accessToken).then(result =>{
                console.log('--------------------getMemberWithAccessToken');
                console.log(result); //MemberDTO
                //redux 버전전
                //dispatch(login(result));

                saveAsCookie(result);

                if(result && result.social){
                    moveToPath('/member/modify');
                }else{
                    moveToPath('/');
                }
            });

            
        })
    }, [authCode]);

    return (
        <div>
            <div>Kakao Login Redirect</div>
            <div>{authCode}</div>
        </div>
    )
}

export default KakaoRedirecPage;