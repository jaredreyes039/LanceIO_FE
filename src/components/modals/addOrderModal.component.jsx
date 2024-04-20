import { useContext, useEffect, useRef, useState } from "react";
import { Datepicker } from 'flowbite-react';
import Cookies from "universal-cookie";
import DATE_PICKER_THEME from "../../utils/datePickerTheme";
import { serviceDataContext } from "../../providers/servicesData.provider";
import ModalContainer from "../ui/modals/ModalContainer.component";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";
import TextAreaInput from "../ui/inputs/TextArea.component";

function isEmpty(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true
}

export default function AddOrderModal(props) {
    let { toast } = props;

    let cookies = new Cookies(null, { path: '/' })
    const userId = cookies.get('user_id')

    // View States
    const [isOpen, setIsOpen] = useState(false)
    const { refreshOrderData, serviceData, refreshServiceData } = useContext(serviceDataContext)

    // Form States
    const [currentSelectedService, setCurrentSelectedService] = useState({})
    const [currentSelectedServiceComponent, setCurrentSelectedServiceComponent] = useState({})
    const [orderPhase, setOrderPhase] = useState(0)
    const [customOrderPriceView, setCustomOrderPriceView] = useState(false)
    const [orderFormData, setOrderFormData] = useState({
        clientRequests: '',
        orderRequirements: '',
        orderDueDate: '',
        paymentDueDate: '',
        differentPayStruct: false,
        orderPrice: 0,
        orderCurrency: '',
        orderPayStruct: '',
        additionalNotes: ''
    })

    // REFS
    const addOrderModal = useRef();

    // FORM HANDLING
    const handleServiceSelection = (e) => {
        if (Object.keys(currentSelectedService).length > 0) {
            currentSelectedServiceComponent.className = currentSelectedServiceComponent.className.replace(' selected-service', '')
            e.currentTarget.className += ' selected-service'
            let service = serviceData.filter((gig) => { return gig._id === e.currentTarget.id })
            service = service[0]
            setCurrentSelectedService(service)
            setCurrentSelectedServiceComponent(e.currentTarget)
        }
        else {
            e.currentTarget.className += ' selected-service'
            let service = serviceData.filter((gig) => { return gig._id === e.currentTarget.id })
            service = service[0]
            setCurrentSelectedService(service)
            setCurrentSelectedServiceComponent(e.currentTarget)
        }
    }
    const handleCustomOrderPriceToggle = (e) => {
        if (e.target.checked) {
            setCustomOrderPriceView(false)
            setOrderFormData({ ...orderFormData, differentPayStruct: false })
        }
        else {
            setCustomOrderPriceView(true)
            setOrderFormData({ ...orderFormData, differentPayStruct: true })
        }
    }
    const handleChangeOrderFormInput = (e) => {
        let inputValue = e.target.value;
        if (e.target.name === 'orderPrice') {
            inputValue = parseInt(inputValue)
        }
        setOrderFormData({ ...orderFormData, [e.target.name]: inputValue })
    }
    const handleChangeDeliveryDate = (date) => {
        date = date.toISOString()
        setOrderFormData({ ...orderFormData, orderDueDate: date })
    }
    const handleChangePaymentDate = (date) => {
        date = date.toISOString()
        setOrderFormData({ ...orderFormData, paymentDueDate: date })
    }
    const handleSubmitOrderForm = async (e) => {
        e.preventDefault()
        try {
            let res = await fetch(process.env.REACT_APP_API_URL_ORDERS + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: props.clientId,
                    serviceId: currentSelectedService._id,
                    userId: userId,
                    clientRequests: orderFormData.clientRequests,
                    orderRequirements: orderFormData.orderRequirements,
                    delDate: orderFormData.orderDueDate,
                    payDate: orderFormData.paymentDueDate,
                    payment: {
                        differentPayStruct: orderFormData.differentPayStruct,
                        price: customOrderPriceView ? orderFormData.orderPrice : currentSelectedService.price,
                        currency: customOrderPriceView ? orderFormData.orderCurrency : currentSelectedService.currency,
                        pay_struct: customOrderPriceView ? orderFormData.orderPayStruct : currentSelectedService.payStruct
                    },
                    additionalNotes: orderFormData.additionalNotes
                })
            })
            if (res.status === 200) {
                toast.success("Order attached to client, see 'Pending Orders' to start tracking and planning your order through to completion!")
                refreshOrderData(userId, cookies.get('token'))
                refreshServiceData(userId, cookies.get('token'))
                setIsOpen(false)
                setOrderPhase(0)
                setCustomOrderPriceView(false)
                setOrderFormData({
                    clientRequests: '',
                    orderRequirements: '',
                    orderDueDate: '',
                    paymentDueDate: '',
                    differentPayStruct: false,
                    orderPrice: 0,
                    orderCurrency: '',
                    orderPayStruct: '',
                    additionalNotes: ''
                })
            }
            else {
                toast("Failed to submit order, please try again later.")
            }
        }
        catch (err) {
            toast('Failed to submit order, please try again later.')
        }
    }

    // VIEW HANDLING
    useEffect(() => {
        if (props.isOpen) {
            setIsOpen(true)
        }
    }, [props.isOpen])
    useEffect(() => {
        if (isOpen) {
            addOrderModal.current.classList.remove('modal-hidden')
            addOrderModal.current.classList.add('modal-visible')
        }
        else {
            addOrderModal.current.classList.remove('modal-visible')
            addOrderModal.current.classList.add('modal-hidden')
        }
    }, [isOpen])

    const handleCloseModal = async () => {
        setIsOpen(false)
        setOrderPhase(0)
        setCustomOrderPriceView(false)
        setOrderFormData({
            clientRequests: '',
            orderRequirements: '',
            orderDueDate: '',
            paymentDueDate: '',
            differentPayStruct: false,
            orderPrice: 0,
            orderCurrency: '',
            orderPayStruct: '',
            additionalNotes: ''
        });
    }

    return (
        <>
            <div ref={addOrderModal} className="hidden z-40 xs:w-full xs:max-lg:flex-col bg-gray-900 flex flex-row  ">
                <ModalContainer closeHandler={handleCloseModal}>
                    <div className="xs:max-lg:mb-4 lg:overflow-y-scroll lg:max-h-[500px] xs:max-lg:w-full p-0 gig-modal-header flex flex-col w-1/2 border-r-2 border-white xs:max-lg:border-0">
                        <h1>Add Client Order</h1>
                        <p className="modal-text mb-8">
                            <p>
                                Now that you have a client, are you ready to add an order?
                                Adding an order is as simple as selecting a service, filling out our simple order form, and
                                clicking submit!
                            </p>
                        </p>
                        <div className="modal-text flex gap-2 items-center mb-2">
                            <p className="underline">Client Details</p>
                        </div>
                        <div className="modal-text flex gap-2 items-center">
                            <span>Client: </span>
                            <p>{props.clientName}</p>
                        </div>
                        <div className="modal-text flex gap-2 items-center">
                            <span>Client Email: </span>
                            <p>{props.clientEmail}</p>
                        </div>
                        <div style={{ display: Object.keys(currentSelectedService).length > 0 ? 'block' : 'none' }} className="modal-text mb-4">
                            <div className="modal-text mb-2">
                                <p className="underline">Service Details</p>
                            </div>
                            <div className="modal-text flex gap-2 items-center">
                                <span>Service: </span>
                                <p>{currentSelectedService.title}</p>
                            </div>
                            <div className="modal-text flex gap-2 items-center">
                                <span>Listed Price:</span>
                                <p>{currencyStringToSymbol(currentSelectedService.currency)}{currentSelectedService.price}{currentSelectedService.payStruct === "fixed" ? " Fixed" : "/hr"}</p>
                            </div>
                            <div className="modal-text flex gap-2 items-center">
                                <span>Est. Delivery Time:</span>
                                <p>{currentSelectedService.estDeliveryTime ? currentSelectedService.estDeliveryTime : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:p-4 xs:max-md:w-full w-1/2">
                        <div style={{ height: '100%', display: orderPhase === 0 ? 'flex' : 'none' }} className="flex flex-col p-2">
                            <div className="modal-text">
                                <span>1. Select a Service</span>
                            </div>
                            <div className="modal-scroll-box mb-8">
                                {serviceData.length > 0 &&
                                    <>
                                        {serviceData.map((gig, index) => {
                                            return (
                                                <li style={{ listStyle: 'none' }} id={gig._id} onClick={(e) => { handleServiceSelection(e) }} className="p-2 gig-planner-item" key={gig._id}>
                                                    <h1 className="modal-text mb-2 underline">
                                                        {gig.title}
                                                    </h1>
                                                    <p className="modal-text mb-2 desc">
                                                        {gig.description}
                                                    </p>
                                                    <div className="flex gap-4 items-center">
                                                        <span className="price-label"></span>
                                                        <p className="modal-text">
                                                            {currencyStringToSymbol(gig.currency)}{gig.price}{gig.payStruct === "fixed" ? " Fixed" : "/hr"}
                                                        </p>
                                                    </div>

                                                </li>
                                            )
                                        })}
                                    </>
                                }
                                {serviceData.length === 0 &&
                                    <>
                                        <p className="modal-text mb-4">
                                            You don't offer any services yet! Create a service first.
                                        </p>
                                        <button className="btn-submit w-1/3 self-end">+ Add Service</button>
                                    </>
                                }
                            </div>
                            <button onClick={() => { setOrderPhase(1) }} disabled={isEmpty(currentSelectedService) ? 1 : 0} className="btn-submit w-1/3 self-end">Next Step</button>
                        </div>
                        <div style={{ height: '100%', display: orderPhase === 1 ? 'flex' : 'none' }} className="flex flex-col">
                            <div className="modal-text">
                                <span>2. Fill Out the Order Form</span>
                            </div>
                            <form className="gig-modal-form flex flex-col" onSubmit={(e) => { handleSubmitOrderForm(e) }}>
                                <div className="modal-text mb-2">
                                    <p className="underline">Order Details</p>
                                </div>
                                <div className="modal-text flex flex-col">
                                    <TextAreaInput
                                        inputName="clientRequests"
                                        label="Client Requests"
                                        placeholder="Enter any requests from the client (i.e. use this color palette, use that font, etc.)..."
                                        changeHandler={handleChangeOrderFormInput}
                                        value={orderFormData.clientRequests}
                                        minHeight={72}
                                        maxHeight={72}
                                    />
                                </div>
                                <div className="modal-text flex flex-col">
                                <TextAreaInput
                                        inputName="orderRequirements"
                                        label="Order Requirements"
                                        placeholder="Enter any requirements for the order (i.e. Must be 3 pages- blog, landing, about)"
                                        changeHandler={handleChangeOrderFormInput}
                                        value={orderFormData.orderRequirements}
                                        minHeight={72}
                                        maxHeight={72}
                                    />
                                </div>
                                <div className="modal-text mb-2">
                                    <p className="underline">Delivery & Payment</p>
                                </div>
                                <div className="modal-text flex flex-col">
                                    <label className="mb-2">When is the order due for delivery?</label>
                                    <Datepicker
                                        value={new Date(orderFormData.orderDueDate).toLocaleDateString()}
                                        onSelectedDateChanged={(date) => { handleChangeDeliveryDate(date) }}
                                        name='orderDueDate' style={{
                                            backgroundColor: '#1E1E1E',
                                            border: 'none',
                                            borderBottom: '1px solid #46CD6E',
                                            borderRadius: '0px',
                                            color: '#F4DBDB'
                                        }} className="mb-6" theme={DATE_PICKER_THEME} />
                                </div>
                                <div className="modal-text flex flex-col">
                                    <label className="mb-2">When would you like to recieve payment?</label>
                                    <Datepicker
                                        onSelectedDateChanged={(date) => { handleChangePaymentDate(date) }}
                                        value={new Date(orderFormData.paymentDueDate).toLocaleDateString()}
                                        style={{
                                            backgroundColor: '#1E1E1E',
                                            border: 'none',
                                            borderBottom: '1px solid #46CD6E',
                                            borderRadius: '0px',
                                            color: '#F4DBDB'
                                        }} className="mb-6" theme={DATE_PICKER_THEME} />
                                </div>
                                <div className="modal-text mb-6 flex items-center">
                                    <input onChange={(e) => { handleCustomOrderPriceToggle(e) }} type="checkbox" className="checkbox mr-2" checked={customOrderPriceView ? false : true} />
                                    <p>Order at listed price</p>
                                </div>
                                <div style={{ display: customOrderPriceView ? 'flex' : 'none' }} className="form-group flex flex-row items-center justify-center">
                                    <span className="modal-text relative left-4">$</span>
                                    <input value={orderFormData.orderPrice} required={customOrderPriceView ? true : false} name="orderPrice" onChange={(e) => { handleChangeOrderFormInput(e) }} style={{ marginBottom: 0 }} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Gig Price" />
                                </div>
                                <div style={{ display: customOrderPriceView ? 'flex' : 'none' }} className="form-group flex flex-row items-center justify-center gap-4">
                                    <select name='orderCurrency' value={orderFormData.orderCurrency} onChange={(e) => { handleChangeOrderFormInput(e) }} required={customOrderPriceView ? true : false} className="select-input">
                                        <option default value="">Select Currency</option>
                                        <option value="usd">USD</option>
                                        <option value="cad">CAD</option>
                                        <option value="eur">EUR</option>
                                        <option value="gbp">GBP</option>
                                        <option value="aud">AUD</option>
                                        <option value="jpy">JPY</option>
                                    </select>
                                    <select name='orderPayStruct' value={orderFormData.orderPayStruct} required={customOrderPriceView ? true : false} onChange={(e) => { handleChangeOrderFormInput(e) }} className="select-input">
                                        <option default value="">Payment Structure</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div className="modal-text mb-2">
                                    <span className="underline">Additional Notes</span>
                                </div>
                                <div className="modal-text flex flex-col">
                                    <textarea value={orderFormData.additionalNotes} name="additionalNotes" onChange={(e) => { handleChangeOrderFormInput(e) }} style={{ height: '72px' }} className="input" type="text" placeholder="Enter any additonal notes that will help you fulfill this order." />
                                </div>
                                <div className="flex justify-between">
                                    <button type='button' onClick={() => {
                                        setOrderPhase(0)
                                    }} className="btn-submit w-1/3">Back</button>
                                    <button type="submit" className="btn-submit w-1/3">Submit Order</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ModalContainer>
            </div>
        </>
    )
}
