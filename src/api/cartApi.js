import { API_SERVER_POST } from "./todoApi";
import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_POST}/api/cart`;

export const getCartItems = async()=>{
    const res = await jwtAxios.post(`${host}/items`);
    return res.data;
}

export const postChangeCart = async(cartItem)=>{
    const res = await jwtAxios.post(`${host}/change` , cartItem);

    return res.data;
}