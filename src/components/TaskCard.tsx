import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Api } from "../api";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { setLoading } from "../redux/reducers/loading";
import { PropsItem } from "../types/types";

export const TaskCard = (data: PropsItem) => {

    const theme = useAppSelector(state => state.theme);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const changeDone = async (_id: string, title: string, done: boolean) => {

        let newDone: boolean;

        if(done) {
            newDone = false;
        } else {
            newDone = true;
        }

        const json = await Api.updateDone(_id, title, newDone);

        if(json.error) {
            alert('erro');
        } else {
            dispatch(setLoading(true));
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/edit/${id}`);
    }

    const handleDeleteTask = async (id: string) => {
        const json = await Api.deleteTask(id);
        if(json.error) {
            alert('Erro ao remover tarefa');
        } else {
            dispatch(setLoading(true));
        }
    }

    return(

        <div className={`form-control border-2 rounded-lg py-5 px-10 shadow-xl flex justify-between gap-5 ${data.data.done ? 'opacity-50' : ''} ${theme.status ? 'bg-white' : 'border-gray-800 bg-gray-700 text-gray-300'}`}>
            <label className="label cursor-pointer flex gap-5">
                <input type="checkbox" className="checkbox checkbox-primary" checked={data.data.done ? true : false} onChange={() => changeDone(data.data._id, data.data.title, data.data.done)}/>
                <div className={`text-base font-semibold ${theme.status ? '' : 'text-gray-300'}`}>{data.data.title}</div>
            </label>
            <div className="flex flex-col gap-5">
                <div className="">
                    {data.data.description}
                </div>
                <div className="flex justify-between mg:flex-col mg:gap-5">
                    <button className={`btn btn-primary ${theme.status ? '' : 'text-black'}`} onClick={() => handleEdit(data.data._id)}>editar</button>
                    <button className="btn btn-warning" onClick={() => handleDeleteTask(data.data._id)}>deletar</button>
                </div>
            </div>
        </div>
    );
};