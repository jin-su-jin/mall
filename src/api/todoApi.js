import axios from "axios"
import jwtAxios from "../util/jwtUtil";


export const API_SERVER_POST = 'http://localhost:8080';

const prefix = `${API_SERVER_POST}/api/todo`;

export const getOne = async(tno) => {
    const res = await jwtAxios.get(`${prefix}/${tno}`);

    return res.data;
}

export const getList = async(pageParam) => {
    const {page , size} = pageParam;
    const res = await jwtAxios.get(`${prefix}/list` , {params:{page,size}});

    return res.data;
}

export const postAdd = async(todoObj) => {
    const res = await jwtAxios.post(`${prefix}/` , todoObj);

    return res.data;
}

export const deleteOne = async(tno) => {
    const res = await jwtAxios.delete(`${prefix}/${tno}` );

    return res.data;
}

export const putOne = async(todoObj) => {
    console.log("putone");
    const res = await jwtAxios.put(`${prefix}/${todoObj.tno}` , todoObj);

    return res.data;
}