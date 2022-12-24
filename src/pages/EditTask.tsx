import React, { useEffect, useState } from "react"
import { Api } from "../api";
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { ListType } from "../types/types";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/reducers/loading";


export const EditTask = () => {

    const navigate = useNavigate();

    const theme = useAppSelector(state => state.theme);
    const loading = useAppSelector(state => state.loading)

    const params = useParams();
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [disable, setDisable] = useState(false);
    const [task, setTask] = useState<ListType>();

    useEffect(() => {
        const getOne = async () => {
            const response = await Api.getOne(params.id as string);

            setTask(response.task);
        }
        getOne();
    });

    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handleSubmit = async () => {

        setDisable(true);

        const _id = params.id as string;

        const json = await Api.updateTask(_id, title, description);

        if(json.error) {
            setDisable(false);
            alert(json.error);
        } else {
            navigate('/');
        }

    }

    const handleCancel = () => {
        dispatch(setLoading(true));
        navigate('/');
    }

    return(
        <div className={`flex justify-center pt-10 pb-10 ${theme.status ? 'bg-white' : 'bg-gray-800'}`}>
            
            <form className={`border-2 rounded-lg py-5 px-10 shadow-xl flex flex-col gap-5 ${theme.status ? '' : 'bg-gray-700 border-gray-800'}`}>
                <div className="flex flex-col items-center gap-3"> 
                    <h1 className="text-3xl font-bold text-primary">Editar</h1>
                    <h2 className={`font-semibold ${theme.status ? '' : 'text-gray-300'}`}>Edite sua tarefa</h2>
                </div>
                <label className={`flex flex-col font-semibold gap-1 ${theme.status ? '' : 'text-gray-300'}`}>
                    Titulo
                    <input
                        className={`input input-primary font-medium ${theme.status ? 'bg-white' : 'bg-gray-700 text-gray-300'}`}
                        type="text"
                        name="title"
                        placeholder={task?.title}
                        value={title}
                        onChange={changeTitle}
                        disabled={disable}
                        required
                    />
                </label>
                <label className={`flex flex-col font-semibold gap-1 ${theme.status ? '' : 'text-gray-300'}`}>
                    Descrição
                    <textarea 
                        className={`textarea textarea-primary font-medium ${theme.status ? 'bg-white' : 'text-gray-300 bg-gray-700'}`}
                        name="description"
                        placeholder={task?.description}
                        value={description}
                        onChange={changeDescription}
                        disabled={disable}
                        required
                    >
                    </textarea>
                </label>
                <button onClick={handleSubmit} className={`btn btn-primary ${theme.status ? '' : 'text-black'}`} disabled={disable}>Salvar</button>
                <button className="btn btn-warning" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    )
}