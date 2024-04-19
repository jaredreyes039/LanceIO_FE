// MOVE TO SEPARATE FILES AND DEF EXPORT SO I CAN ADD TO STORYBOOK

export function TextInput(props) {
	const { value, placeholder, label, inputName, changeHandler } = props;
	return (
		<>
			<label htmlFor={inputName}>{label}</label>
			<input
				name={inputName}
				placeholder={placeholder}
				className="input"
				type="text"
				required
				value={value}
				onChange={(e) => { changeHandler(e) }}
			/>
		</>
	)
}

export function PriceInput(props) {
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

export function TextAreaInput(props) {
	const { value, placeholder, label, inputName, minHeight, maxHeight, changeHandler } = props;
	return (
		<>
			<label htmlFor={inputName}>{label}</label>
			<textarea
				style={{
					minHeight: minHeight + 'px',
					maxHeight: maxHeight + 'px',
					height: '100%'
				}}
				className="input"
				value={value}
				placeholder={placeholder}
				name={inputName}
				onChange={(e) => { changeHandler(e) }}
				required
			/>
		</>
	)
}
