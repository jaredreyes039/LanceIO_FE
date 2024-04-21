import { fn } from '@storybook/test';
import PriceInput from "./PriceInput.component.jsx"
import { useState } from "react";

export default {
	component: PriceInput,
	title: "Price Input Field",
	tags: ["autodocs"],
}

const Template = () => {
	const [locVal, setLocVal] = useState(0);
	const handleChange = (e) => {
		setLocVal(e.currentTarget.value)
	}
	return (
		<PriceInput
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
