import { useEffect, useRef, useState } from "react";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { deleteOne, getOne, putOne } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_POST } from "../../api/todoApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const initState = {
    pno : 0,
    pname :'',
    pdesc :'',
    price : 0,
    delFlag:false,
    uploadFileName:[]
}

const host = API_SERVER_POST;

function ModifyComponent({pno}){

    const [product , setProduct] = useState(initState);
    const uploadRef = useRef();
    const [result,setResult] = useState(null);
    const [fetching,setFetching] = useState(false);
    const {moveToList , moveToRead} = useCustomMove();

    const query = useQuery({
        queryKey:['product',pno],
        queryFn:()=>getOne(pno),
        staleTime : Infinity
    });

    const delMutation = useMutation({
        mutationFn :()=>deleteOne(pno)
    });

    const modMutation = useMutation({
        mutationFn : (formData)=> putOne(pno , formData)
    })

    useEffect(()=>{
        setFetching(true);
        if(query.isSuccess){
            setProduct(query.data);
        }
        /*
        getOne(pno).then(data =>{
            console.log(data);

            setProduct(data);
            setFetching(false);
        });*/
    } , [pno, query.data , query.isSuccess]);

    const handleChangeProduct = (e) => {
        product[e.target.name] = e.target.value;
        setProduct({...product});
    }

    const handleClickModify = (e) => {
        console.log(product);

        const formData = new FormData();
        const files = uploadRef.current.files;

        for(let i=0; i<files.length;i++){
            formData.append("files" , files[i]);
        }

        formData.append("pname" , product.pname);
        formData.append("pdesc" , product.pdesc);
        formData.append("price" , product.price);
        formData.append("delFlag" , product.delFlag);

        for(let i=0;i<product.uploadFileName.length;i++){
            formData.append("uploadFileName" , product.uploadFileName[i]);

            console.log(product.uploadFileName[i]);
        }

        modMutation.mutate(formData);
/*
        setFetching(true);
        putOne(pno,formData).then(data => {

            setFetching(false);
            setResult('Modified');
        });
*/
    }

    const deleteOldImage = (imageName)=>{
        const resultFileNames = product.uploadFileName.filter(fileName => fileName !==imageName);
        product.uploadFileName = resultFileNames;
        setProduct({...product});

    }

    //삭제 이벤트
    const handleClickDelete = ()=>{
        delMutation.mutate();
        /*
        setFetching(true);

        deleteOne(pno).then(data => {
            setFetching(false);
            setResult('Deleted');
        });
*/
    }

    const queryClient = useQueryClient();

    const closeModal = () =>{
        queryClient.invalidateQueries(['product', pno]);
        queryClient.invalidateQueries(['product/list']);

        if(delMutation.isSuccess){          
            moveToList();
        }

        if(modMutation.isSuccess){
            moveToRead(pno);
        }
        /*
        if(result == 'Modified'){
            moveToRead(pno);
        }else{
            moveToList();
        }

        setResult(null);
       */
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
            <div    className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">DELETE</div>
                    <select name="delFlag"value={product.delFlag}onChange={handleChangeProduct}
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md">
                        <option value={false}>사용</option>
                        <option value={true}>삭제</option>
                    </select>
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
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Images</div>
                    <div className="w-4/5 justify-center flex flex-wrap items-start">
                        {product.uploadFileName.map( (imgFile, i) =>
                            <div className="flex justify-center flex-col w-1/3 m-1 align-baseline" key = {i}>
                                <button className="bg-blue-500 text-3xl text-white" 
                                    onClick={()=> deleteOldImage(imgFile)}>DELETE</button>
                                <img alt ="img" src={`${host}/api/products/view/s_${imgFile}`}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end p-4">
                <button type="button"
                    onClick={handleClickDelete}
                    className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500">
                    Delete
                </button>
                <button type="button" onClick={handleClickModify}
                    className="rounded p-4 m-2 text-xl w-32 text-white bg-orange-500">
                    Modify </button>
                <button type="button"
                    onClick={moveToList}
                    className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500">
                    List
                </button>
            </div>
            {query.isFetching || delMutation.isPending || modMutation.isPending? <FetchingModal/> : <></>}
            {delMutation.isSuccess || modMutation.isSuccess? <ResultModal
                            title={`${result}`} 
                            content={`처리되었습니다.`} 
                            callbackFn={closeModal}/> : <></>}
        </div>
    )
}

export default ModifyComponent;