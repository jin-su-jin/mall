import axios from "axios"

import { API_SERVER_POST } from "./todoApi";

const host = `${API_SERVER_POST}/api/member`;


export const loginPost = async(loginParam) => {
    const header = {header : {'Content-Type':'x-www-form-urlencoded'}};

    const form = new FormData();
    form.append("username" , loginParam.email);
    form.append("password" , loginParam.pw);

    const res = await axios.post(`${host}/login` , form , header);

    return res.data;
}

export const modifyMember =async(member) =>{
    const res = await axios.put(`${host}/modify` , member );
    return res.data;
}