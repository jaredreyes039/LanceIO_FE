import TextInput from "./Input.component"
import { fn } from '@storybook/test';
import { useState } from "react";
export default {
	component: TextInput,
	title: "Text Input Field",
	tags: ["autodocs"],
}

const Template = () => {
	const [locVal, setLocVal] = useState("");
	const handleChange = (inputValue) => {
		setLocVal(inputValue)
	}
	return (
		<TextInput
			value={locVal}
			placeholder="Template"
			label="Template Label"
			inputName="templateInput"
			direction={true}
			type="text"
			changeHandler={handleChange}
		/>)

}

export const Default = Template.bind({})
