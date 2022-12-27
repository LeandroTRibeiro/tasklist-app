import React, { useEffect, useState } from "react"
import { Api } from "../api";
import { ListType } from "../types/types";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { setReverse } from "../redux/reducers/reverseList";
import { TaskCard } from "../components/TaskCard";
import { setLoading } from "../redux/reducers/loading";
import { SearchAlert } from "../components/SearchAlert";
import { Link } from 'react-router-dom';

export const Home = () => {

    const reverse = useAppSelector(state => state.reverseList);
    const loading = useAppSelector(state => state.loading);
    const theme = useAppSelector(state => state.theme);

    const dispatch = useDispatch();

    const [list, setList] = useState<ListType[]>([]);

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

        loadList();

    },[loading]);

    const reverseList = [...list].reverse();

    const handleDoneChange = async (_id: string, done: boolean, title: string) => {

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

            const changeDone = [...list];
            changeDone.map((item) => {
                if(item._id === _id) {
                    item.done = newDone;
                    setList(changeDone);
                };
            });
            
        }
        
    };

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
        <div className={`flex justify-center pt-10 pb-10 ${theme.status ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="mx:w-[280px] ms:w-[325px] mg:w-[425px] tb:w-[768px] w-[1024px] flex flex-col items-center gap-10">
                <div className="w-full">
                    <div className="flex gap-5 mg:flex-col">
                        <Link to='/newtask' className={` btn btn-primary ${theme.status ? '' : 'text-black'}`}>Adicionar Tarefa</Link>
                        
                        <label className="input-group">
                            <input
                                className={`input input-bordered input-primary w-full max-w-xs ${theme.status ? 'bg-white' : 'bg-gray-800 text-gray-300'}`}
                                type="text"
                                name="query"
                                placeholder="Pesquisar"
                                value={inputSearch}
                                onChange={changeSearch}
                            />
                            <span className={theme.status ? "btn btn-primary" : "btn btn-primary text-black"} onClick={handleSearch}>Pesquisar</span>
                        </label>
                        
                        {!reverse.status &&
                            <button className={theme.status ? "btn btn-primary" : "btn btn-primary text-black"} onClick={handleReverse}>Ordenar por mais novas</button>
                        }
                        {reverse.status &&
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
                            <SearchAlert />
                        }

                        {search && !errorSearch &&
                            <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                                {searchList.map((item) => (
                                    <TaskCard key={item._id} data={item} onDone={handleDoneChange}/>
                                ))}
                            </div>
                        }
                    
                        <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                            {reverseList.map((item) => (
                            
                                <TaskCard key={item._id} data={item} onDone={handleDoneChange} />

                            ))}
                        </div>
                        </>
                    }

                    {!reverse.status &&
                        <>
                        {search && errorSearch &&
                            <SearchAlert />
                        }

                        {search && !errorSearch &&
                            <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                                {searchList.map((item) => (
                                    <TaskCard key={item._id} data={item} onDone={handleDoneChange}/>
                                ))}
                            </div>
                        }
                        <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                            {list.map((item) => (

                                <TaskCard key={item._id} data={item} onDone={handleDoneChange}/>

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

