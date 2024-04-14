import { useEffect, useState } from 'react';
import LOGOSVG from '../assets/LanceLogo.svg';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Login(props) {

    const AUTH_URL = process.env.REACT_APP_API_URL_AUTH

    const cookies = new Cookies(null, { path: '/' });

    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isAuth, setIsAuth] = useState(null);

    // Login form should be abstracted
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register form should be abstracted
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

    // Register form should be abstracted
    const handleRegisterFormSubmit = async (e) => {
        e.preventDefault();

        if (registerPassword !== registerConfirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const response = await fetch(AUTH_URL + '/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: registerUsername,
                email: registerEmail,
                password: registerPassword
            })
        });
        const data = await response.json();
        if (data) {
            toast("Registered successfully, welcome to LanceIO, and goodluck on your freelancing ventures!")
            setIsRegistering(false)
        }
    }

    // Login form should be abstracted
    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        let token = cookies.get('token')
        const response = await fetch(AUTH_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword,
                token: token
            })
        });
        const data = await response.json();

        cookies.set('token', data.token, { path: '/' });
        cookies.set('username', loginUsername, { path: '/' })
        cookies.set('user_id', data.user_id, { path: '/' })

        if (data.token) {
            setIsAuth(true)
        }
    }

    useEffect(() => {
        const token = cookies.get('token');
        if (token) {
            setIsAuth(true)
        }
    }, [])

    useEffect(() => {
        if (isAuth) {
            navigate("/dashboard")
        }
    }, [isAuth])

    return (
        <>
            <ToastContainer />
            <div className="login-container p-12 flex flex-1 w-full justify-center">
                <div className="flex w-fit h-fit self-center flex-col items-center">
                    <div className="logo-container">
                        <img src={LOGOSVG} alt="logo" />
                    </div>
                    <h1 className="site-header text-4xl text-center">Lance.IO</h1>
                    {isRegistering ?
                        <>
                            <form className="flex flex-col w-full items-center">
                                <input onChange={(e) => { setRegisterUsername(e.target.value) }} value={registerUsername} type="text" className="input" placeholder="Username" />
                                <input onChange={(e) => { setRegisterEmail(e.target.value) }} value={registerEmail} type="email" className="input" placeholder="Email Address" />
                                <input onChange={(e) => { setRegisterPassword(e.target.value) }} value={registerPassword} type="password" className="input" placeholder="Password" />
                                <input onChange={(e) => { setRegisterConfirmPassword(e.target.value) }} value={registerConfirmPassword} type="password" className="input" placeholder="Confirm Password" />
                                <button onClick={(e) => { handleRegisterFormSubmit(e) }} className="btn btn-primary">Register</button>
                            </form>
                            <p className="text-center text-white">Already have an account? <span className="link" onClick={() => setIsRegistering(false)}>Login</span></p>
                        </>
                        : // CONDITIONAL SEPARATED HERE
                        <>
                            <form className="flex flex-col w-full items-center">
                                <input onChange={(e) => { setLoginUsername(e.target.value) }} value={loginUsername} type="text" className="input" placeholder="Username" />
                                <input onChange={(e) => { setLoginPassword(e.target.value) }} value={loginPassword} type="password" className="input" placeholder="Password" />
                                <button onClick={(e) => { handleLoginFormSubmit(e) }} className="btn btn-primary">Login</button>
                            </form>
                            <p className="text-center text-white">Don't have an account? <span className="link" onClick={() => setIsRegistering(true)}>Register Here!</span></p>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
