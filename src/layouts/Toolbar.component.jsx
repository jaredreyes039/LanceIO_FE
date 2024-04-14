import '../styles/components/toolbar.css'
import LOGOSVG from '../assets/LanceLogo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { toast, ToastContainer } from 'react-toastify';

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


    return (
        <>
            <ToastContainer />
            <div className="toolbar-container flex flex-col flex-1 items-center">
                <div className='user-info flex flex-col justify-center items-center'>
                    <img src="./icons/userIcon.svg" alt="userImg" className='user-image' />
                    <p className='user-name'>@{username}</p>
                </div>
                <div className='nav-container flex flex-col justify-center'>
                    <div onClick={() => { handlePageNav('/services') }} ref={gigNavItem} className='nav-item'>
                        <img src='./icons/GigsIcon.svg' alt="home" />
                        <p>Services, Orders, & Invoicing</p>
                    </div>
                    <div onClick={(e) => { handlePageNav('/dashboard') }} ref={dashboardNavItem} className='nav-item'>
                        <img src='./icons/DashboardIcon.svg' alt="home" />
                        <p>Summary</p>
                    </div>
                    <div onClick={(e) => { handlePageNav('/user') }} ref={userNavItem} className='nav-item'>
                        <img src='./icons/userIcon.svg' alt="home" />
                        <p>User Settings</p>
                    </div>
                </div>
                <div className='footer-container flex flex-col items-center'>
                    <img src={LOGOSVG} alt="logo" className='logo' />
                    <p className='brand-text'>Lance.IO</p>
                    <button onClick={(e) => { handleLogout(e) }} className='btn'>LogOut</button>
                </div>
            </div>
        </>
    )
}
