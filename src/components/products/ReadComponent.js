import { useEffect, useState } from "react";
import { API_SERVER_POST } from "../../api/todoApi";
import { getOne } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import useCustomMove from "../../hooks/useCustomMove";
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useQuery } from "@tanstack/react-query";

const initState = {
    pno : 0,
    pname :'',
    pdesc :'',
    price : 0,
    uploadFileName:[]
}

const host = API_SERVER_POST;

function ReadComponent({pno}){
    //useQuery 를 사용하면서 주석처리함함
    //const [product , setProduct] = useState(initState);
    //const [fetching , setFetching] = useState(false);

    const {moveToList , moveToModify , page , size} = useCustomMove();
    //현재 사용자의 아이탬들
    const  {cartItems , changeCart} = useCustomCart();
    //로그인 정보
    const {loginState} = useCustomLogin();

    //버전 5 에서 파라미터가 객체로 처리함 ,버전4 에서는 다름
    //Fresh -> stale 상태를 만들수 있다다
    const {data , isFetching} = useQuery({
        queryKey:['product', pno],
        queryFn: ()=> getOne(pno),
        staleTime:1000*10 // 10초 동안은 재 호출하지 않는다 
    })
/*
    useEffect(()=>{
        setFetching(true);
        getOne(pno).then(data =>{
            console.log(data);
            setProduct(data);

            setFetching(false);
        });
    } , [pno]);
*/
    const handleClickAddCart = ()=>{
        console.log(cartItems);
        
        let qty = 1;
        const addedItem = cartItems.filter(item=>item.pno == pno)[0];
        if(addedItem){
            if(window.confirm("이미 추가된 상품입니다. 추가하시겠습니까?")){
                qty = addedItem.qty + 1;
            }else{

                return;
            }
        }

        changeCart({email:loginState.email , qty:qty , pno:pno});


    }

    const product = data || initState;

    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4">
            {isFetching? <FetchingModal/> :<></>}
            <div className="flex justify-center mt-10">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">PNO</div>
                    <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">{product.pno}</div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">PNAME</div>
                    <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">{product.pname}</div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">PRICE</div>
                    <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">{product.price}</div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">PDESC</div>
                    <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">{product.pdesc}</div>
                </div>
            </div>
            <div className="w-full justify-center flex flex-col m-auto items-center">
                 {product.uploadFileName.map( (imgFile, i) =>
                    <img alt ="product" key={i} className="p-4 w-1/2"src={`${host}/api/products/view/${imgFile}`}/>
                    )}
            </div>
            <div className="flex justify-end p-4">
                <button type="button"
                     className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"
                    onClick={() => handleClickAddCart(pno)}
                >
                    Add Cart
                </button>
                 <button type="button"
                     className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                    onClick={() => moveToModify(pno)}
                >
                    Modify
                </button>
                <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"onClick={()=>moveToList({page,size})}>
                    List
                </button>
            </div>
        </div>

    );

}


export default ReadComponent;