import PropTypes from "prop-types";

export default function TextInput(props) {
	const { type, direction, value, placeholder, label, inputName, changeHandler } = props;
	return (
		<div className="flex" style={{
			flexDirection: direction ? "column" : "row",
			gap: direction ? '0px' : '6px',
			alignItems: !direction ? "center" : "unset"
		}}>
			<label style={{ display: label ? "inline-block" : "none" }} htmlFor={inputName}>{label}</label>
			<input
				name={inputName}
				placeholder={placeholder}
				className="input"
				type={type ? type : "text"}
				required
				value={value}
				onChange={(e) => { changeHandler(e) }}
			/>
		</div>
	)
}

TextInput.propTypes = {
	type: PropTypes.string,
	direction: PropTypes.bool,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	inputName: PropTypes.string,
	changeHandler: PropTypes.func
}
