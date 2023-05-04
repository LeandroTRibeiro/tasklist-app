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
            setSearch(false);
            organizeList(response.tasks);
        }

        loadList();

    },[loading]);

    const organizeList = (list: ListType[]) => {

        let first: ListType[];
        let second: ListType[];
        let correct: ListType[];

        first = list.filter((item) => {
            if(!item.done) {
                return item;
            } 
        });

        second = list.filter((item) => {
            if(item.done) {
                return item;
            }
        });

        correct = [...first, ...second];

        setList(correct);
        dispatch(setLoading(false));
    }

    const handleDoneChange = async (_id: string, done: boolean, title: string) => {

        let newDone: boolean;

        if(done) {
            newDone = false;
        } else {
            newDone = true;
        }

        const changeDone = [...list];
        const searchListDone = [...searchList];

        changeDone.map((item) => {
            if(item._id === _id) {
                item.done = newDone;
                setList(changeDone);
            };
        });

        searchListDone.map((item) => {
            if(item._id === _id) {
                item.done = newDone;
                setSearchList(searchListDone);
            };
        });

        const json = await Api.updateDone(_id, title, newDone);

        if(json.error) {
            dispatch(setLoading(false));
            alert('erro');
        } 
        
    };

    const handleReverse = () => {

        const reverseList = [...list].reverse();

        if (reverse.status) {
            dispatch(setReverse(false));
            organizeList(reverseList);
        } else {
            dispatch(setReverse(true));
            organizeList(reverseList);
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

    const handleDeleteTask = async (id: string) => {

        let deleteItem = list.filter((item) => {
            if(item._id != id) {
                return item;
            }
        });

        setList(deleteItem);
        
        const json = await Api.deleteTask(id);

        if(json.error) {
            alert('Erro ao remover tarefa');
        }
    }

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputSearch(e.target.value);
    }

    const handleDeleteAlert = () => {
        setErrorSearch(false);
        setSearch(false);
    };

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
                    <div className="h-[100vh]">
                        <button className={`btn btn-primary loading ${theme.status ? '' : 'text-black'}`}>loading</button>
                    </div>
                }

                {!loading.status &&
                    <>
                        {search && errorSearch &&
                            <div className="w-full cursor-pointer" onClick={handleDeleteAlert}>
                                <SearchAlert />
                            </div>
                        }

                        {search && !errorSearch &&
                            <div className="w-full flex flex-col gap-5 p-5 border-2 border-primary rounded-lg">
                                <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5 ">
                                    {searchList.map((item) => (
                                        <TaskCard key={item._id} data={item} onDone={handleDoneChange} onDelete={handleDeleteTask}/>
                                    ))}
                                </div>
                                <button className="btn btn-primary text-black" onClick={() => setSearch(false)}>Limpar Pesquisa</button>
                            </div>
                        }
                        {list.length > 0 &&
                            <div className="grid ms:grid-cols-1 mg:grid-cols-2 grid-cols-3 gap-5">
                                {list.map((item) => (

                                    <TaskCard key={item._id} data={item} onDone={handleDoneChange} onDelete={handleDeleteTask}/>

                                ))}
                            </div>
                        }
                        {list.length <= 0 &&
                            <div className="p-20">
                                <div className={`flex flex-col items-center gap-2 border border-primary rounded-lg p-5 ${theme.status ? '' : 'text-gray-300'}`}>
                                    <h1 className="text-3xl font-bold text-primary">DevTasks</h1>
                                    <h2 className="font-semibold mt-[-5px]">Você não possui tarefas no momento!</h2>
                                    <p className="">Vamos começar?</p>
                                    <Link to='/newtask' className={` btn btn-primary ${theme.status ? '' : 'text-black'}`}>Adicionar Tarefa</Link>
                                </div>
                            </div>
                        }
                    </>
                }

            </div>
        </div>
    )
}

