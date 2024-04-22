import { useContext, useEffect, useRef, useState } from "react";
import { formSliderContext } from "../../providers/formSlider.provider";
import Cookies from "universal-cookie";
import { modalContext } from "../../providers/modal.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";
import TextInput from "../ui/inputs/Input.component";
import PriceInput from "../ui/inputs/PriceInput.component"
import TextAreaInput from "../ui/inputs/TextArea.component"

export default function ServiceBasicForm(props) {

    // FORM VARS
    const currencyList = [
        "USD",
        "CAD",
        "EUR",
        "GBP",
        "AUD",
        "JPY"
    ]
    const currencySymbolsList = currencyList.map((currency) => {
        return currencyStringToSymbol(currency)
    })
    const estDeliveryOptions = [
        "1 day",
        "2 days",
        "1 week",
        "2 weeks",
        "1 month",
        "2 months",
        "3 months",
        "6 months",
        "12 months"
    ]

    // TOKEN AND USERID
    let cookies = new Cookies(null, { path: "/" });

    // REFS
    const basicPlanningForm = useRef();

    //  CONTEXTS
    let { setCurrentModal } = useContext(modalContext);
    let { currentPosition, setCurrentPosition } = useContext(formSliderContext);
    let { refreshServiceData, refreshOrderData } = useContext(serviceDataContext)

    // FORM HANDLING STATES
    const [gigName, setGigNameBasic] = useState("");
    const [gigDescription, setGigDescriptionBasic] = useState("");
    const [gigPrice, setGigPriceBasic] = useState("");
    const [gigCurrency, setGigCurrencyBasic] = useState("");
    const [gigPaymentType, setGigPaymentTypeBasic] = useState("");
    const [gigEstDeliveryTime, setGigEstDeliveryTime] = useState("");
    const [err, setErr] = useState(0);

    // INPUT HANDLING: BOTH FORMS
    const handleGigName = (e) => {
        setGigNameBasic(e.target.value);
    }
    const handleGigDescription = (e) => {
        setGigDescriptionBasic(e.target.value);
    }
    const handleGigPrice = (e) => {
        setGigPriceBasic(e.target.value);
    }
    const handleGigCurrency = (e) => {
        setGigCurrencyBasic(e.target.value);
    }
    const handleGigPaymentType = (e) => {
        setGigPaymentTypeBasic(e.target.value);
    }
    const handleChangeDeliveryDate = (e) => {
        setGigEstDeliveryTime(e.target.value);
    }

    function checkFields() {
        if (gigName.length == 0 || gigDescription.length == 0 || gigEstDeliveryTime.length == 0 || gigCurrency.length == 0) {
            return 0;
        }
        if (gigPrice == 0) {
            return 0;
        }
        return 1;
    }

    const handleSumbitBasic = async (e) => {
        e.preventDefault();
        if (checkFields()) {
            try {
                const token = cookies.get("token");
                const user_id = cookies.get("user_id");
                const username = cookies.get("username");

                let res = await fetch(process.env.REACT_APP_API_URL_BASIC + "/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: token,
                        user_id: user_id,
                        username: username,
                        title: gigName,
                        description: gigDescription,
                        price: gigPrice,
                        currency: gigCurrency,
                        payStruct: gigPaymentType,
                        totalIncome: gigPrice,
                        estDeliveryTime: gigEstDeliveryTime,
                    })
                })

                if (res.status === 200) {
                    refreshServiceData(user_id, token)
                    setGigNameBasic("");
                    setGigDescriptionBasic("");
                    setGigPriceBasic("");
                    setGigCurrencyBasic("");
                    setGigPaymentTypeBasic("");
                    setGigEstDeliveryTime("");
                    setCurrentPosition(0)
                    setCurrentModal("")
                }
                else {
                    console.log("error")
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            setErr(1);
        }

    }
    const handleUpdateServiceBasic = async (e) => {
        e.preventDefault();
        try {
            const token = cookies.get("token");
            const user_id = cookies.get("user_id");
            const username = cookies.get("username");

            let res = await fetch(process.env.REACT_APP_API_URL_BASIC + `/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: props.serviceEdit._id,
                    token: token,
                    user_id: user_id,
                    username: username,
                    title: gigName,
                    description: gigDescription,
                    price: gigPrice,
                    currency: gigCurrency,
                    payStruct: gigPaymentType,
                    orders: 0,
                    totalIncome: gigPrice,
                    estDeliveryTime: gigEstDeliveryTime,
                })
            })

            if (res.status === 200) {
                setCurrentModal("")
                await refreshServiceData(user_id, token)
                await refreshOrderData(user_id, token)
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    // VIEW AND EDIT EFFECTS
    useEffect(() => {
        if (currentPosition === 0) {
            basicPlanningForm.current.classList.remove("hidden-alt");
        }
        else {
            basicPlanningForm.current.classList.add("hidden-alt");
        }
    }, [currentPosition])
    useEffect(() => {
        if (props.edit) {
            setGigNameBasic(props.serviceEdit.title);
            setGigDescriptionBasic(props.serviceEdit.description);
            setGigPriceBasic(props.serviceEdit.price);
            setGigCurrencyBasic(props.serviceEdit.currency);
            setGigPaymentTypeBasic(props.serviceEdit.payStruct);
            setGigEstDeliveryTime(props.serviceEdit.estDeliveryTime);
        }
    }, [props.edit])


    if (!props.edit) {
        return (
            <>
                {err === 1 && <p className="text-red-500 text-md py-2">Check that all forms are filled properly. Note: Price can not be 0.</p>}
                <form onSubmit={(e) => { handleSumbitBasic(e) }} ref={basicPlanningForm} className="gig-modal-form flex flex-col">
                    <TextInput direction label="Service Name" inputName="serviceName" value={gigName} changeHandler={handleGigName} placeholder={"Enter Service Name..."} />
                    <TextAreaInput value={gigDescription} changeHandler={handleGigDescription} placeholder="Enter Service Description..." inputName="serviceDescription" label="Service Description" minHeight={100} maxHeight={120} />
                    <PriceInput direction value={gigPrice} changeHandler={handleGigPrice} inputName="servicePrice" placeholder="Enter Service Price..." label="Service price" />
                    <div className="mb-2 flex flex-row xs:max-lg:flex-col items-center justify-center gap-4">
                        <select value={gigCurrency} onChange={(e) => { handleGigCurrency(e) }} required className="select-input">
                            <option default value="">Select Currency</option>
                            {currencyList.map((currency, i) => {
                                return <option value={currency}>{currency} ({currencySymbolsList[i]})</option>
                            })}
                        </select>
                        <select value={gigPaymentType} onChange={(e) => { handleGigPaymentType(e) }} required className="select-input">
                            <option default value="">Payment Structure</option>
                            <option value="hourly">Hourly</option>
                            <option value="fixed">Fixed</option>
                        </select>
                    </div>
                    <div className="mb-2 flex flex-row items-center justify-center gap-4">
                        <select style={{ width: '100%' }} value={gigEstDeliveryTime} onChange={(e) => { handleChangeDeliveryDate(e) }} required className="select-input">
                            <option default value="">Est. Delivery Time</option>
                            {estDeliveryOptions.map((option) => {
                                return <option value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                    <button type="submit" className="btn-submit w-1/3 self-end">+ Add Gig</button>
                </form>
            </>
        )
    }
    else {
        return (
            <>
                <form onSubmit={(e) => { handleUpdateServiceBasic(e) }} ref={basicPlanningForm} className="gig-modal-form flex flex-col">
                    <label htmlFor="Gig Name">Gig Name</label>
                    <input onChange={(e) => { handleGigName(e) }} value={gigName} required className="input" type="text" placeholder="Gig Name" />
                    <label htmlFor="Gig Description">Gig Description</label>
                    <textarea style={{
                        height: '100px'
                    }} onChange={(e) => { handleGigDescription(e) }} value={gigDescription} required className="input" type="text" placeholder="Gig Description" />
                    <label htmlFor="CostDel">Est. Delivery Time</label>
                    <div className="mb-2 flex flex-row items-center justify-center gap-4">
                        <select style={{ width: '100%' }} value={gigEstDeliveryTime} onChange={(e) => { handleChangeDeliveryDate(e) }} required className="select-input">
                            <option default value="">Est. Delivery Time</option>
                            {estDeliveryOptions.map((option) => {
                                return <option value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                    <button type="submit" className="btn-submit w-1/3 self-end">Save Edits</button>
                </form>
            </>
        )
    }
}
