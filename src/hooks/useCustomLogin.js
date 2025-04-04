import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate , createSearchParams } from "react-router-dom"
import { loginPostAsync, logout } from "../slices/loginSlice";
import { useRecoilState, useResetRecoilState } from "recoil";
import { signinState } from "../atoms/signinState";
import { loginPost } from "../api/memberApi";
import { removeCookie, setCookie } from "../util/cookieUtil";
import { cartState } from "../atoms/cartState";


const useCustomLogin = () => {
    //Recoil 이용버전
    const [loginState , setLoginState] = useRecoilState(signinState);
    const resetState = useResetRecoilState(signinState);
    const resetCartState = useResetRecoilState(cartState);


    const navigate = useNavigate();

    const dispatch = useDispatch();

    const exceptionHandle = (ex) => {
        console.log("Exception------------------------")  
        console.log(ex)
    
        const errorMsg = ex.response.data.error   
        const errorStr = createSearchParams({error: errorMsg}).toString()
    
        if(errorMsg === 'REQUIRE_LOGIN'){
          alert("로그인 해야만 합니다.")
          navigate({pathname:'/member/login' , search: errorStr})
    
          return
        }
    
        if(ex.response.data.error === 'ERROR_ACCESSDENIED'){
          alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.")
          navigate({pathname:'/member/login' , search: errorStr})
          return 
        }
      }

    //redux 버전전
   // const loginState = useSelector(state=>state.loginSlice);

    const isLogin = loginState.email ? true : false; //로그인 여부

    const doLogin = async(loginParam)=>{
        // redux 버전
        //const action = await dispatch(loginPostAsync(loginParam));
        //return action.payload;

        const result = await loginPost(loginParam);
        saveAsCookie(result);
        

        return result;
    }

    const saveAsCookie = (data)=>{
        setCookie("member" , JSON.stringify(data) , 1);
        setLoginState(data);
    }

    //로그아웃하기
    const doLogout = ()=>{
        // redux 버전
        //dispatch(logout());

        removeCookie("member");
        resetState(); //recoil 정보 지우기
        resetCartState(); //recoil 정보 지우기
    }

    const moveToPath = (path) => {
        navigate({pathname:path} , {replace:true})
    }

    //로그인 페이지로 이동동
    const moveToLogin = () =>{
        navigate({pathname:'/member/login'} , {replace:true})
    }

    //로그인 페이지로 이동 컴포넌트
    const moveToLoginReturn = ()=>{
        return <Navigate replace to="/member/login" />
    } 

    return {loginState, isLogin , doLogin , doLogout , moveToPath , moveToLogin ,  moveToLoginReturn , saveAsCookie , exceptionHandle}

}

export default useCustomLogin;