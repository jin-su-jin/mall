import { useDispatch, useSelector } from "react-redux"
import { getCartItemAsync, postChangeCartAsync } from "../slices/cartSlice";
import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems, postChangeCart } from "../api/cartApi";
import { useEffect } from "react";

const useCustomCart = ()=>{
    /*
    const cartItems = useSelector(state => state.cartSlice);

    const dispatch = useDispatch();

    const refreshCart = ()=>{
        dispatch(getCartItemAsync());
    }

    const changeCart = (param)=>{
        dispatch(postChangeCartAsync(param));
    }

    return {cartItems , refreshCart , changeCart};
    */

    const [cartItems , setCartItems] = useRecoilState(cartState);

    const queryClient = useQueryClient();

    const changeMutatition = useMutation({
        mutationFn: (param)=> postChangeCart(param),
        onSuccess: (result) => {
            console.log("====change==");
            console.log(result);
            setCartItems(result);
        },
        onError :()=>{
            setCartItems([]);
        }
    });

    const query = useQuery({
        queryKey:['cart'],
        queryFn : getCartItems,
        staleTime : 1000*60*60
    });

    useEffect(()=>{
        if(query.isSuccess){
            queryClient.invalidateQueries('cart');
            setCartItems(query.data);
        }
        
    }, [query.isSuccess]);

    const changeCart = (param) => {
        changeMutatition.mutate(param);
    }

    return {cartItems  , changeCart};
}

export default useCustomCart;

