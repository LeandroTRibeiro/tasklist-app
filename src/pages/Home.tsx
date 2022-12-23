import React, { useEffect, useState } from "react"
import { Api } from "../api";
import { ListType } from "../types/types";
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { setReverse } from "../redux/reducers/reverseList";
import { TaskCard } from "../components/TaskCard";
import { setLoading } from "../redux/reducers/loading";

export const Home = () => {

    const navigate = useNavigate();

    const reverse = useAppSelector(state => state.reverseList);
    const loading = useAppSelector(state => state.loading);
    const theme = useAppSelector(state => state.theme);

    const dispatch = useDispatch();

    const [list, setList] = useState<ListType[]>([]);
    const [reverseList, setReverseList] = useState<ListType[]>([]);

    const [inputSearch, setInputSearch] = useState('');
    const [searchList, setSearchList] = useState<ListType[]>([]);
    const [search, setSearch] = useState(false);
    const [errorSearch, setErrorSearch] = useState(false);

    useEffect(() => {
        const loadList = async () => {
            const response = await Api.getAllTasks();
            setList(response.tasks);
            dispatch(setLoading(false));
            setSearch(false);
        }
        const loadListTwo = async () => {
            const response = await Api.getAllTasks();
            setReverseList(response.tasks.reverse());
            dispatch(setLoading(false));
            setSearch(false);
        }
        loadList();
        loadListTwo();
    },[loading]);

    const handleAddTask = () => {
        navigate('/newtask');
    }


    const handleReverse = () => {

        if (reverse.status) {
            dispatch(setReverse(false));

        } else {
            dispatch(setReverse(true));

        }
    };

    const handleSearch = async () => {

        const json = await Api.searchTask(inputSearch);

        if(json.error) {
            setSearch(true);
            setErrorSearch(true);
        } else {
            setSearch(true);
            setErrorSearch(false);
            setSearchList(json.task);
        }
    }

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputSearch(e.target.value);
    }

    return(
        <div className={`bg-white flex justify-center pt-10 pb-10 ${theme.status ? '' : 'bg-gray-800'}`}>
            <div className="mx:w-[280px] ms:w-[325px] mg:w-[425px] tb:w-[768px] w-[1024px] flex flex-col items-center gap-10">
                <div className="w-full">
                    <div className="flex gap-5 mg:flex-col">
                        <button className={` btn btn-primary ${theme.status ? '' : 'text-black'}`} onClick={handleAddTask}>Adicionar Tarefa</button>
                        
                        <label className="input-group">
                            <input
                                className={`bg-white input input-bordered input-primary w-full max-w-xs ${theme.status ? '' : 'bg-gray-800 text-gray-300'}`}
                                type="text"
                                name="query"
                                placeholder="Pesquisar"
                                value={inputSearch}
                                onChange={changeSearch}
                            />
                            <span className={theme.status ? "btn btn-primary" : "btn btn-primary text-black"} onClick={handleSearch}>Pesquisar</span>
                        </label>
                        
                        {reverse.status &&
                            <button className={theme.status ? "btn btn-primary" : "btn btn-primary text-black"} onClick={handleReverse}>Ordenar por mais novas</button>
                        }
                        {!reverse.status &&
                            <button className={theme.status ? "btn btn-primary" : "btn btn-primary text-black"} onClick={handleReverse}>Ordenar por mais antigas</button>
                        }
                    </div>
                </div>

                {loading.status &&
                    <button className="btn loading">loading</button>
                }

                {!loading.status &&
                    <>
                    {reverse.status &&
                        <>
                        {search && errorSearch &&
                            <div className="alert alert-error shadow-lg">
                                <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Não encontramos nenhuma tarefa!</span>
                                </div>
                            </div>
                        }

                        {search && !errorSearch &&
                            <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                                {searchList.map((item) => (
                                    <TaskCard key={item._id} data={item} />
                                ))}
                            </div>
                        }
                    
                        <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                            {reverseList.map((item) => (
                                <>
                                {!item.done &&
                                    <TaskCard key={item._id} data={item} />
                                }
                                {item.done &&
                                    <TaskCard key={item._id} data={item} />
                                }

                                </>
                            ))}
                        </div>
                        </>
                    }

                    {!reverse.status &&
                        <>
                        {search && errorSearch &&
                            <div className="alert alert-error shadow-lg">
                                <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Não encontramos nenhuma tarefa!</span>
                                </div>
                            </div>
                        }

                        {search && !errorSearch &&
                            <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                                {searchList.map((item) => (
                                    <TaskCard key={item._id} data={item} />
                                ))}
                            </div>
                        }
                        <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                            {list.map((item) => (
                                <>
                                {item.done &&
                                    <TaskCard key={item._id} data={item} />
                                }
                                {!item.done &&
                                    <TaskCard key={item._id} data={item} />
                                }
                                </>
                            ))}
                        </div>
                        </>
                    }
                    </>
                }

            </div>
        </div>
    )
}

