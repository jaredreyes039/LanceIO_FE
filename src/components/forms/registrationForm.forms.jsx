import { useState, useEffect } from 'react';
import TextInput from '../ui/inputs/Input.component.jsx'
import { ToastContainer, toast } from 'react-toastify';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { registerSchema } from "../../utils/formValidationSchema.util"

export default function RegistrationForm() {

	// TODO: ADD PASSWORD REQUIREMENT CHECKLIST

	const {
		register,
		reset,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm({ resolver: yupResolver(registerSchema) });

	const methods = { register, reset }

	function onSubmit(data) {
		// TODO: INTERFACE WITH USERS SERVER
		console.log(data);
	}

	useEffect(() => {
		reset({
			name: "data",
		})
	}, [reset])

	return (
		<>
			<ToastContainer />
			<FormProvider {...methods}>
				<span className="form-error">{errors.username?.message}</span>
				<span className="form-error">{errors.email?.message}</span>
				<span className="form-error">{errors.password?.message}</span>
				<span className="form-error">{errors.confirmPassword?.message}</span>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						label="Username"
						inputName="username"
						direction="column"
						placeholder="Enter username"
					/>
					<TextInput
						type="email"
						label="Email Address"
						inputName="email"
						direction="column"
						placeholder="Enter email address"
					/>
					<TextInput
						type="password"
						label="Password"
						inputName="password"
						direction="column"
						placeholder="Enter password"
					/>
					<TextInput
						type="password"
						label="Confirm Password"
						inputName="confirmPassword"
						direction="column"
						placeholder="Confirm password"
					/>
					{/* TODO: INSERT TOS AGREEMENT AND SUB OPTION HERE */}
					<button
						class="btn btn-submit"
						type="submit">
						Register
					</button>
				</form >
			</FormProvider>
		</>
	);
}
