import { useEffect, useState } from 'react';
import LOGOSVG from '../assets/LanceLogo.svg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import TextInput from '../components/ui/inputs/Input.component';
import RegistrationForm from '../components/forms/registrationForm.forms.jsx';
import LoginForm from '../components/forms/loginForm.forms.jsx';
import LoadingSpinner from '../components/ui/loadingSpinner.component';

export default function Login(props) {

	// TODO: IMPLEMENT LOGIN FORM
	// TODO: WRITE TESTS

	const AUTH_URL = process.env.REACT_APP_API_URL_AUTH

	const navigate = useNavigate();

	// DISPLAY STATES
	const [isLoading, setIsLoading] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [isAuth, setIsAuth] = useState(false);


	// WARNING: USEFFECT SHOULD BE MOVED TO THE TOP AND IS MISSING A DEP
	useEffect(() => {
		if (isAuth) {
			navigate("/dashboard")
		}
	}, [isAuth])


	return (
		<>
			<ToastContainer />
			<div className="login-container bg-black p-12 flex flex-1 w-full justify-center">
				<div className="flex w-fit h-fit self-center flex-col items-center">
					<div className="logo-container">
						<img src={LOGOSVG} alt="logo" />
					</div>
					<h1 className="site-header text-4xl text-center">Lance.IO</h1>
					{!isLoading ? isRegistering ?
						<RegistrationForm />
						:
						<LoginForm />
						:
						<LoadingSpinner />
					}
				</div>
			</div>
		</>
	)
}
