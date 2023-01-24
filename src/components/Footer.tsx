import logo from '../assets/githublogo.png';
import { useAppSelector } from '../redux/hooks/useAppSelector';
import logoDark from '../assets/githubdark.png';

export const Footer = () => {

    const theme = useAppSelector(state => state.theme);

    return(
        <footer className={`footer footer-center p-10 bg-primary text-primary-content pt-10 ${theme.status ? '' : "bg-primary text-black"}`}>
            <div>
                <h1 className="text-4xl font-bold">DevTasks</h1>
                <p className="text-base">
                    powered by <br/> <a target="_blank" href="https://github.com/LeandroTRibeiro">Leandro Thiago Ribeiro</a>
                </p> 
            </div> 
            <div>
                <div className="grid grid-flow-col gap-4">
                    <a target="_blank" href='https://github.com/LeandroTRibeiro'>
                        <img src={theme.status ? logo : logoDark} alt="logo github" className='w-[70px]'/>
                    </a> 
                </div>
            </div>
        </footer>
    );
};