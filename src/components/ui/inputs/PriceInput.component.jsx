import PropTypes from "prop-types";

export default function PriceInput(props) {
	const { value, direction, placeholder, label, inputName, changeHandler } = props;
	return (
		<div className="flex w-full" style={{
			flexDirection: direction ? "column" : "row",
			gap: direction ? '0px' : '6px',
			alignItems: !direction ? "center" : "unset"
		}}>

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
		</div>
	)
}

PriceInput.propTypes = {
	value: PropTypes.number,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	inputName: PropTypes.string,
	changeHandler: PropTypes.func,
	direction: PropTypes.bool
}
