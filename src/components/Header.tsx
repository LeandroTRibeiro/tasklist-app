import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks/useAppSelector';
import { BtnTheme } from './ThemeBtn';

export const Header = () => {

    const theme = useAppSelector(state => state.theme);

    return(

        <div className={` flex justify-center ${theme.status ? 'bg-white' : 'bg-gray-700'}`}>
            <div className="mx:w-[280px] ms:w-[325px] mg:w-[425px] tb:w-[768px] w-[1024px] h-[80px] flex justify-between items-center">
                <div className={theme.status ? "text-3xl font-bold text-primary" : "text-3xl font-bold text-black"}>
                    <Link to='/'>
                        DevTasks
                    </Link>
                </div>
                <nav className='flex items-center'>
                    <BtnTheme />
                </nav>
            </div>
        </div>
    );
};