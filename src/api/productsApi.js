import axios from "axios"

import { API_SERVER_POST } from "./todoApi";
import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_POST}/api/products`;



export const postAdd = async(product) => {
    const header = {headers : {'Content-Type':'multipart/form-data'}};

    const res = await jwtAxios.post(`${host}/` , product , header);

    return res.data;
}

export const getList = async(pageParam) => {
    const {page , size} = pageParam;
    const res = await jwtAxios.get(`${host}/list` , {params:{page,size}});

    return res.data;
}

export const getOne = async(pno) => {
    const res = await jwtAxios.get(`${host}/${pno}`);

    return res.data;
}

export const deleteOne = async(pno) => {
    const res = await jwtAxios.delete(`${host}/${pno}` );

    return res.data;
}

export const putOne = async(pno , product) => {
    const header = {headers : {'Content-Type':'multipart/form-data'}};
    const res = await jwtAxios.put(`${host}/${pno}` , product , header);

    return res.data;
}
