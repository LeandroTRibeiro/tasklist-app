import React, { useState } from "react"
import { Api } from "../api";
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks/useAppSelector";

export const NewTask = () => {

    const navigate = useNavigate();

    const theme = useAppSelector(state => state.theme);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [disable, setDisable] = useState(false);

    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handleSubmit = async () => {

        setDisable(true);

        const json = await Api.createTask(title, description);

        if(json.error) {
            setDisable(false);
            alert(json.error);
        } else {
            navigate('/');
        }

    }

    const handleCancel = () => {
        navigate('/');
    }

    return(
        <div className={`bg-white flex justify-center pt-10 pb-10 ${theme.status ? '' : 'bg-gray-800'}`}>
            
            <form className={`border-2 rounded-lg py-5 px-10 shadow-xl flex flex-col gap-5 ${theme.status ? '' : 'bg-gray-700 border-gray-800'}`}>
                <div className="flex flex-col items-center gap-3"> 
                    <h1 className="text-3xl font-bold text-primary">Nova Tarefa</h1>
                    <h2 className={`font-semibold ${theme.status ? '' : 'text-gray-300'}`}>Adicione uma nova tarefa</h2>
                </div>
                <label className={`flex flex-col font-semibold gap-1 ${theme.status ? '' : 'text-gray-300'}`}>
                    Titulo
                    <input
                        className={`input input-primary font-medium ${theme.status ? '' : 'bg-gray-700 text-gray-300'}`}
                        type="text"
                        name="title"
                        placeholder="Digite o titulo"
                        value={title}
                        onChange={changeTitle}
                        disabled={disable}
                        required
                    />
                </label>
                <label className={`flex flex-col font-semibold gap-1 ${theme.status ? '' : 'text-gray-300'}`}>
                    Descrição
                    <textarea 
                        className={`textarea textarea-primary font-medium ${theme.status ? '' : 'text-gray-300 bg-gray-700'}`}
                        name="description"
                        placeholder="Digite a descrição da tarefa"
                        value={description}
                        onChange={changeDescription}
                        disabled={disable}
                        required
                    >
                    </textarea>
                </label>
                <button onClick={handleSubmit} className={`btn btn-primary ${theme.status ? '' : 'text-black'}`} disabled={disable}>Adicionar</button>
                <button onClick={handleCancel} className="btn btn-warning">Cancelar</button>
            </form>
        </div>
    )
}