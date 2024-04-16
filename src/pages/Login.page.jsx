import { useEffect, useState } from 'react';
import LOGOSVG from '../assets/LanceLogo.svg';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Login(props) {

    const AUTH_URL = process.env.REACT_APP_API_URL_AUTH

    const cookies = new Cookies(null, { path: '/' });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true)
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
            setIsLoading(false)
            toast("Registered successfully, welcome to LanceIO, and goodluck on your freelancing ventures!")
            setIsRegistering(false)
        }
    }

    // Login form should be abstracted
    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        // Sending token to receive token? Will thidds break, and how do I even get this initially?
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
            setIsLoading(false)
            setIsAuth(true)
        }
        else {
            setIsLoading(false)
            setIsAuth(false)
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
                    {!isLoading ? isRegistering ?
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
                        :
                        <div role="status">
                            <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
