export default function TextAreaInput(props) {
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
