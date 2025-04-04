import ModifyComponent from "../../components/todo/ModifyComponent";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';

const ModifyPage = () => {
    const navigate = useNavigate();
    const {tno} = useParams();

    const [queryParams] = useSearchParams();

    const page = queryParams.get('page') ? parseInt(queryParams.get('page')) : 1;
    const size = queryParams.get('size') ? parseInt(queryParams.get('size')) : 10;

    const queryStr = createSearchParams({page:page,size:size}).toString();

    return ( 
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                Todo Modify Page 
            </div>
            <ModifyComponent tno={tno}/>
        </div>
    );
}

    export default ModifyPage;