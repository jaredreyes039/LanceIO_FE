import * as Yup from 'yup';

let registerSchema = Yup.object().shape({
	username: Yup.string().min(6, 'Must be at least 6 characters long.').required(),
	email: Yup.string().min(3, 'Must be at least 3 characters long.').email('Invalid email address.').required('Email address is required.'),
	password: Yup.string().min(6, 'Must be at least 6 characters long').matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
		.required('Password is required'),
})

export const validateFormData = (FormData, flag) => {
	switch (flag) {
		case "auth":
		case "register":

	}
}
