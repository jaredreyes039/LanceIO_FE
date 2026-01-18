import { useState, useEffect } from 'react';
import TextInput from '../ui/inputs/Input.component.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/formValidationSchema.util.js";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {

	const {
		register,
		reset,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm({ resolver: yupResolver(loginSchema) });


	const methods = { register, reset };
	const navigate = useNavigate();

	function onSubmit(formData) {
		axios({
			method: 'POST',
			url: 'http://localhost:5000/auth/login',
			data: formData
		})
			.then((res) => {
				if (res.status === 503) {
				}
				else {
					navigate("/dashboard")
				}
			})
			.catch((err) => console.log(err))
	}

	useEffect(() => {
		reset({
			name: "data"
		})
	}, [reset])

	return (
		<>
			<ToastContainer />
			<FormProvider {...methods}>
				<span className="form-error">{errors.username?.message}</span>
				<span className="form-error">{errors.password?.message}</span>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						label="Username"
						inputName="username"
						direction="column"
						placeholder="Enter username"
					/>
					<TextInput
						type="password"
						label="Password"
						inputName="password"
						direction="column"
						placeholder="Enter password"
					/>
					{/* TODO: INSERT TOS AGREEMENT AND SUB OPTION HERE */}
					<button
						class="btn btn-submit"
						type="submit">
						Login
					</button>
				</form >
			</FormProvider>
		</>
	)
}
