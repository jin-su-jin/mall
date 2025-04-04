import { useRef, useState } from "react";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { postAdd } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const initState = {
    pname :'',
    pdesc :'',
    price : 0,
    files:[]
}

function AddComponent(props){

    const [product , setProduct] = useState(initState);
    const uploadRef = useRef();
    const [result,setResult] = useState(null); //addMutation.data 로 대체
    const [fetching,setFetching] = useState(false); //addMutation.isPending 으로 대체
    const {moveToList} = useCustomMove();

    const addMutation = useMutation({mutationFn:(product)=> postAdd(product)});

    const handleChangeProduct = (e) => {
        product[e.target.name] = e.target.value;
        setProduct({...product});
    }

    const handleClickAdd = (e) => {
        console.log(product);

        const formData = new FormData();
        const files = uploadRef.current.files;

        for(let i=0; i<files.length;i++){
            formData.append("files" , files[i]);
        }

        formData.append("pname" , product.pname);
        formData.append("pdesc" , product.pdesc);
        formData.append("price" , product.price);

        setFetching(true);
        addMutation.mutate(formData);
        /*
        postAdd(formData).then(data => {
            setFetching(false); 
            setResult(data.result);
        });
*/
    }

    const queryClient = useQueryClient();

    const closeModal = () =>{
        setResult(null);
        queryClient.invalidateQueries("product/list"); //queryKey 가 같으면 재호출이 되지 않으므로 기존 값을 무효화한다
        moveToList();
    }

    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4">
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                            name="pname" type={'text'} 
                            value={product.pname} 
                            onChange={handleChangeProduct}></input>
                </div>
                  
            </div>     
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Desc</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                            name="pdesc" type={'text'} 
                            value={product.pdesc} 
                            onChange={handleChangeProduct}></input>
                </div> 
            </div>      
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Price</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                        name="price" type={'number'} value={product.price} onChange={handleChangeProduct}></input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Files</div>
                        <input
                            ref={uploadRef}
                            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                            type={'file'} multiple={true}>
                        </input>
                    </div>
            </div>
            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                    <button type="button"
                        onClick={handleClickAdd}
                            className="rounded p-4 w-36 bg-blue-500 text-xl text-white" > ADD </button>
                </div>
            </div>

            {addMutation.isPending ? <FetchingModal/> : <></>}
            {addMutation.isSuccess ? <ResultModal
                            title={'Product Add Result'} 
                            content={`${addMutation.data.result} 번 등록완료`} 
                            callbackFn={closeModal}/> : <></>}
        </div>
    )
}

export default AddComponent;