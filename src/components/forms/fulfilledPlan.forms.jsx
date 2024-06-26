import { useContext, useEffect, useRef, useState } from "react"
import { TimeTable } from "./activePlan.forms"
import { serviceDataContext } from "../../providers/servicesData.provider"
import { modalContext } from "../../providers/modal.provider"
import PaymentModal from "../modals/PaymentModal.component"


export default function FulfilledPlanForm(props) {
    let { toast } = props

    let { order, token } = props
    const [currentOrder, setCurrentOrder] = useState(order)
    let orderId = order._id
    let orderRequirements = order.orderRequirements
    let clientRequests = order.clientRequests

    const fulfilledForm = useRef()
    const [finalComments, setFinalComments] = useState("")
    const { orderData } = useContext(serviceDataContext)
    const { setCurrentModal } = useContext(modalContext)

    const openPaymentModal = (e) => {
        e.preventDefault();
        setCurrentModal("paymentModal")
    }

    const handleFinalCommentsChange = (e) => {
        e.preventDefault();
        setFinalComments(e.currentTarget.value)
    }

    useEffect(() => {
        setCurrentOrder(orderData.filter((order) => { return order._id === orderId })[0])
    }, [orderData, order, orderId])

    const handleGenerateInvoice = async (e) => {
        e.preventDefault();
        const response = await fetch(process.env.REACT_APP_API_URL_INVOICES + '/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: orderId,
                order: currentOrder,
                token: props.token,
                finalComments: finalComments
            }),
        })
        toast.success("Invoice generated successfully, thank you for using LanceIO!")
    }

    return (
        <>
            <PaymentModal toast={toast} order={order} />
            <div className="p-4 gig-modal-form  md:max-h-[620px] md:h-[540px] xs:max-md:h-dvh flex-col overflow-y-scroll ">
                <h1 className="text-2xl text-white mb-4">Order Summary</h1>
                <div className="modal-text mb-4">
                    <span>Order #: </span>
                    <p>{currentOrder._id}</p>
                </div>
                <div className="modal-text mb-4">
                    <span>Client Requests: </span>
                    <p>{clientRequests}</p>
                </div>
                <div className="modal-text mb-4">
                    <span>Order Requirements: </span>
                    <p>{orderRequirements}</p>
                </div>
                <TimeTable editingAllowed={false} token={token} orderData={order} ></TimeTable>

                <form onSubmit={(e) => { handleGenerateInvoice(e) }} ref={fulfilledForm} className="flex flex-col">
                    <label htmlFor="Gig Description">Final Comments (Not Included in Invoice)</label>
                    <textarea style={{
                        height: '100px'
                    }} onChange={(e) => { handleFinalCommentsChange(e) }} value={finalComments} className="input" type="text" placeholder="Final comments..." />
                    <div className="w-full flex md:flex-col h-fit xs:max-sm:h-[120px] xs:max-sm:gap-4">
                        <button type="submit" className="btn-submit w-1/3 md:self-end xs:max-sm:w-full">Generate Invoice</button>
                        <button className="btn-submit w-1/3 md:self-end xs:max-sm:w-full" type="button" onClick={(e) => { openPaymentModal(e) }}>Add Payment</button>
                    </div>
                </form>

            </div>
        </>
    )
}                    
