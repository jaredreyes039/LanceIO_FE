import '../styles/components/toolbar.css'
import LOGOSVG from '../assets/LanceLogo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { slide as Menu } from 'react-burger-menu'

export default function ToolBar(props) {

    let location = useLocation();
    let navigate = useNavigate();

    let dashboardNavItem = useRef();
    let gigNavItem = useRef();
    let invoiceNavItem = useRef();
    let userNavItem = useRef();

    let cookies = new Cookies(null, { path: '/' });
    let username = cookies.get('username') ? cookies.get('username') : "";
    username = username.charAt(0).toUpperCase() + username.slice(1);

    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_API_URL_AUTH + "/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: cookies.get('username'),
                token: cookies.get('token')
            })
        });
        const data = await response.json();
        if (data.success) {
            cookies.remove('username')
            cookies.remove('user_id')
            cookies.remove('token');
            navigate('/');
        }
    }

    // PATH HANDLING
    const handlePageNav = (path) => {
        if (path !== '/user') {
            navigate(path);
        }
        else {
            toast.error("Settings coming in the near future, check in periodically for updates!")
        }
    }
    useEffect(() => {
        switch (location.pathname) {
            case '/services':
                gigNavItem.current.classList.add('selected');
                break;
            case '/dashboard':
                dashboardNavItem.current.classList.add('selected');
                break;
            case '/invoices':
                invoiceNavItem.current.classList.add('selected');
                break;
            case '/user':
                //userNavItem.current.classList.add('selected');
                break;
            default:
                break;
        }
    }, [location.pathname])

    function showSettings(e) {
        e.preventDefault();
    }

    return (
        <>
            <ToastContainer />
            <div className="xs:max-sm:hidden min-w-48 bg-gray-900 flex flex-col flex-1 items-center">
                <div className='user-info w-full flex flex-col justify-center items-center mb-16 mt-16'>
                    <img src="./icons/userIcon.svg" alt="userImg" className='w-16 mb-8 ' />
                    <p className='user-name text-center'>@{username}</p>
                </div>
                <div className='mb-8 flex flex-col w-full justify-center'>
                    <div onClick={() => { handlePageNav('/services') }} ref={gigNavItem} className='mb-4 w-full flex text-white gap-4 px-2 py-2'>
                        <img src='./icons/GigsIcon.svg' alt="home" />
                        <p>Services, Orders, & Invoicing</p>
                    </div>
                    <div onClick={(e) => { handlePageNav('/dashboard') }} ref={dashboardNavItem} className='mb-4 w-full flex text-white gap-4 px-2 py-2'>
                        <img src='./icons/DashboardIcon.svg' alt="home" />
                        <p>Summary</p>
                    </div>
                    <div onClick={(e) => { handlePageNav('/user') }} ref={userNavItem} className='w-full flex text-white gap-4 px-2 py-2'>                        <img src='./icons/userIcon.svg' alt="home" />
                        <p>User Settings</p>
                    </div>
                </div>
                <div className='w-full flex flex-col items-center'>
                    <img src={LOGOSVG} alt="logo" className='w-1/3' />
                    <p className='brand-text mb-8'>Lance.IO</p>
                    <button onClick={(e) => { handleLogout(e) }} className='text-center font-bold w-2/3 bg-green-300 rounded-full px-4 py-2'>LogOut</button>
                </div>
            </div>
            <div className="w-16 h-16 absolute items-center justify-center rounded-full z-50 bottom-2 right-2 bg-white md:max-xl:hidden">
                <div className="flex flex-col items-center justify-center text-bold text-black">
                    <div className="flex flex-col justify-center h-16 w-fit">
                        <div className="border-t-2 border-black w-8 h-2"></div>
                        <div className="border-t-2 border-black w-8 h-2"></div>
                        <div className="border-t-2 border-black w-8 h-2"></div>
                    </div>
                </div>
                <Menu className="bg-gray-800 absolute left-0 top-0 bg-opacity-100">
                    <a id="home" className="px-2 py-4 text-white text-xl border-r-2 border-white" href="/" ref={dashboardNavItem}>Summary</a>
                    <a id="services" className="px-2 py-4 text-white text-xl border-r-2 border-white" href="/services" ref={gigNavItem}>Services, Orders, & Invoices</a>
                </Menu>
            </div>
        </>
    )
}
