import PropTypes from "prop-types";

export default function PriceInput(props) {
	const { value, placeholder, label, inputName, changeHandler } = props;
	return (
		<>
			<label htmlFor={inputName}>{label}</label>
			<input
				className="input"
				name={inputName}
				placeholder={placeholder}
				type="number"
				step={0.01}
				max={999999.00}
				min={0}
				value={value}
				onChange={(e) => { changeHandler(e) }}
				required
			/>
		</>
	)
}

PriceInput.propTypes = {
	value: PropTypes.number,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	inputName: PropTypes.string,
	changeHandler: PropTypes.func
}
