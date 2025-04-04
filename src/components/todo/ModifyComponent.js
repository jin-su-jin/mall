import { useState , useEffect } from "react";
import { putOne , getOne, deleteOne } from "../../api/todoApi";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    title:'',
    writer:'',
    dueDate:'',
    complete:false
}

function ModifyComponent({tno}){
    const [todo,setTodo] = useState({...initState});

    useEffect(()=>{
        getOne(tno).then(data=>{
            console.log(data);
            setTodo(data);
        })
    } , [tno]);

   
    const [result,setResult] = useState(null);
    const {moveToList , moveToRead} = useCustomMove();

    const [todoText,setTodoText] = useState('');
    const handleChangeTodo = (e)=>{
        // todo[title]
        todo[e.target.name] = e.target.value;
        
        setTodoText( e.target.value);
        setTodo(todo);
    }

    const handleChangeTodoComplete = (e) => {
        const value = e.target.value;
        todo.complete = (value === 'Y');
        setTodo( {...todo});
    }

    const handleClickDelete = () => {
        deleteOne(tno).then(data => {
            console.log("delete result :" ); //{RESULT  SUCCESS}
            console.log(data);
            //목록으로
            setResult('Deleted');
        })
    }

    const handleClickModify = ()=> {
        putOne(todo).then(result => {
            setResult('Modified');
            setTodo({...initState});
        })
    }

    const closeModal = () =>{
        if(result === 'Deleted'){
            moveToList();
        }else{
            moveToRead(tno);
        }
        setResult(null);
       
    }

    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4">
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                            name="title" type={'text'} 
                            value={todo.title} 
                            onChange={handleChangeTodo}></input>
                </div>
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                            name="writer" type={'text'} 
                            value={todo.writer} 
                            onChange={handleChangeTodo}></input>
                </div>   
            </div>           
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
                        name="dueDate" type={'date'} value={todo.dueDate} onChange={handleChangeTodo}></input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">COMPLETE</div>
                    <select name="status" className="border-solid border-2 rounded m-1 p-2"
                        onChange={handleChangeTodoComplete} value = {todo.complete? 'Y':'N'} >
                        <option value='Y'>Completed</option>
                        <option value='N'>Not Yet</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end p-4">
                <button type="button" className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                    onClick={handleClickDelete}
                >
                    Delete </button>
                <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
                     onClick={handleClickModify}
                > Modify </button>
            </div>

            {result ? <ResultModal 
                            title={'처리결과'} 
                            content={result} 
                            callbackFn={closeModal}/> : <></>}
        </div>
    )
}

export default ModifyComponent;