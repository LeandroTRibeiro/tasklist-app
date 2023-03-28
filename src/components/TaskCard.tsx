import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Api } from "../api";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { setLoading } from "../redux/reducers/loading";
import { PropsItem } from "../types/types";

export const TaskCard = (props: PropsItem) => {

    const theme = useAppSelector(state => state.theme);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleEdit = (id: string) => {
        navigate(`/edit/${id}`);
    }

    return(

        <div className={`form-control min-w-[300px] border-2 rounded-lg py-5 px-10 shadow-xl flex justify-between gap-5 ${props.data.done ? 'opacity-50' : ''} ${theme.status ? 'bg-white' : 'border-gray-800 bg-gray-700 text-gray-300'}`}>
            <label className="label cursor-pointer flex gap-5">
                <input type="checkbox" className="checkbox checkbox-primary" checked={props.data.done ? true : false} onChange={() => props.onDone(props.data._id, props.data.done, props.data.title)}/>
                <div className={`text-base font-semibold ${theme.status ? '' : 'text-gray-300'}`}>{props.data.title}</div>
            </label>
            <div className="flex flex-col gap-5">
                <div className="">
                    {props.data.description}
                </div>
                <div className="flex justify-between mg:flex-col mg:gap-5">
                    <button className={`btn btn-primary ${theme.status ? '' : 'text-black'}`} onClick={() => handleEdit(props.data._id)}>editar</button>
                    <button className="btn btn-warning" onClick={() => props.onDelete(props.data._id)}>deletar</button>
                </div>
            </div>
        </div>
    );
};