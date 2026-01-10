import { useState } from 'react';
import TextInput from '../ui/inputs/Input.component.jsx'
import { ToastContainer, toast } from 'react-toastify';
import { validateFormData } from "../../utils/validateFormData.util"

export default function RegistrationForm() {

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [tosAgreed, setTosAgreed] = useState(false);
	const [subscribed, setSubscribed] = useState(false);

	const handleChangeUsername = (e) => {
		setUsername(e.target.value);
	}
	const handleChangeEmail = (e) => {
		setEmail(e.target.value);
	}
	const handleChangePassword = (e) => {
		setPassword(e.target.value);
	}
	const handleChangeConfirmPassword = (e) => {
		setConfirmPassword(e.target.value);
	}
	const handleSubscription = (e) => {
		setSubscribed((prev) => !prev);
	}

	const getCompiledFormData = () => {
		const formData = new FormData();
		formData.append("username", username);
		formData.append("password", password);
		formData.append("email", email);
		return formData;
	}

	const handleSubmission = (e) => {
		// TODO: ADD FORM SANITIZATION FUNCTION HERE
		e.preventDefault();
		validateFormData(getCompiledFormData());
		if (confirmPassword !== password) {
			toast.error("Passwords do not match, please check your entires and try again.");
			return;
		}

		if (process.env.NODE_ENV === "development") {
			toast.success("Succesfully registered, check localStorage to analyze payload.")
		}
		if (process.env.NODE_ENV === "production") {
			// TODO: RECONNECT WITH BACKEND USER SERVICE WHEN LANCEIO_USERS SERVER IS READY FOR DEPLOYMENT
		}
		return;
	}

	return (
		<>
			<ToastContainer />
			<form onSubmit={(e) => { handleSubmission(e) }}>
				<TextInput
					type="text"
					label="Username"
					inputName="username"
					direction="column"
					placeholder="Enter username"
					changeHandler={handleChangeUsername}
					required={true}
				/>
				<TextInput
					type="email"
					label="Email Address"
					inputName="email"
					direction="column"
					placeholder="Enter email address"
					changeHandler={handleChangeEmail}
					required={true}
				/>
				<TextInput
					type="password"
					label="Password"
					inputName="password"
					direction="column"
					placeholder="Enter password"
					changeHandler={handleChangePassword}
					required={true}
				/>
				<TextInput
					type="password"
					label="Confirm Password"
					inputName="confirmPassword"
					direction="column"
					placeholder="Confirm password"
					changeHandler={handleChangeConfirmPassword}
					required={true}
				/>
				{/* TODO: INSERT TOS AGREEMENT AND SUB OPTION HERE */}
				<button
					class="btn btn-submit"
					type="submit">
					Register
				</button>
			</form >
		</>
	);
}
