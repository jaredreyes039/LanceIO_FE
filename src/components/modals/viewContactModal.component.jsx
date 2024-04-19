import { useContext, useEffect, useRef, useState } from "react";
import AddOrderModal from "./addOrderModal.component";
import { modalContext } from "../../providers/modal.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";



export default function ViewContactModal(props) {
    const { toast } = props;

    // VIEW STATES
    const { currentModal, setCurrentModal } = useContext(modalContext);
    const { serviceData, orderData } = useContext(serviceDataContext);
    const [isOpen, setIsOpen] = useState(false)

    // DATA STATES
    const [allServices, setAllServices] = useState([])
    const [clientOrders, setClientOrders] = useState([])
    const [latestOrder, setLatestOrder] = useState({})
    const [pendingOrders, setPendingOrders] = useState([])
    const [activeOrders, setActiveOrders] = useState([])
    const [fulfilledOrders, setFulfilledOrders] = useState([])
    const [cancelledOrders, setCancelledOrders] = useState([])
    const [amountOwed, setAmountOwed] = useState(0)
    const [amountPaid, setAmountPaid] = useState(0)

    // VIEW REFS
    const viewContactModal = useRef();

    // VIEW HANDLING
    useEffect(() => {
        if (props.isOpen) {
            setIsOpen(true)
        }
    }, [props.isOpen])

    // Allows modal to be visible
    useEffect(() => {
        if (isOpen) {
            viewContactModal.current.classList.remove('modal-hidden')
            viewContactModal.current.classList.add('modal-visible')
        }
        else {
            viewContactModal.current.classList.remove('modal-visible')
            viewContactModal.current.classList.add('modal-hidden')
        }
    }, [isOpen])

    // Get the orders of the client and set the latest order
    useEffect(() => {
        let sortedOrders = orderData.filter((order) => { return order.client_id === props.clientId })
        setClientOrders(sortedOrders)
        if (sortedOrders.length > 0) {
            let recentOrder = sortedOrders[sortedOrders.length - 1];
            recentOrder.serviceTitle = serviceData.filter((service) => { return service._id === recentOrder.service_id })[0].title
            recentOrder.serviceDescription = serviceData.filter((service) => { return service._id === recentOrder.service_id })[0].description
            setLatestOrder(recentOrder)
        }
    }, [orderData, serviceData, props.clientId])

    // ORDER AND SERVICE DATA
    useEffect(() => {
        setAllServices(serviceData)
    }, [serviceData, clientOrders])

    useEffect(() => {
        setPendingOrders(clientOrders.filter((order) => { return order.order_status.pending === 1 }))
        setActiveOrders(clientOrders.filter((order) => { return order.order_status.active === 1 }))
        setFulfilledOrders(clientOrders.filter((order) => { return order.order_status.completed === 1 }))
        setCancelledOrders(clientOrders.filter((order) => { return order.order_status.cancelled === 1 }))
        setLatestOrder(clientOrders[clientOrders.length - 1])
    }, [clientOrders])

    useEffect(() => {
        let owedSum = clientOrders.reduce((prev, next) => {
            return prev + next.payment.amountOwed
        }, 0)
        let paidSum = clientOrders.reduce((prev, next) => {
            return prev + next.payment.amountPaid
        }, 0)
        setAmountOwed(owedSum)
        setAmountPaid(paidSum)
        console.log(clientOrders)
    }, [clientOrders])

    const handleCloseModal = async () => {
        setIsOpen(false)
        await setCurrentModal('')
    }

    return (
        <>
            <AddOrderModal
                toast={toast}
                isOpen={currentModal === 'addOrderModal' ? true : false}
                clientName={props.clientName}
                clientEmail={props.clientEmail}
                clientId={props.clientId}
            ></AddOrderModal>

            <div ref={viewContactModal}
                className="hidden gig-modal xs:w-full xs:max-lg:flex-col bg-gray-900 flex flex-row  overflow-y-scroll">
                <div className="close-modal-btn">
                    <button onClick={() => { handleCloseModal() }}
                        style={{
                            color: "#ffffff",
                            fontSize: "12pt",
                            fontWeight: "bold",
                            backgroundColor: "transparent",
                            position: 'absolute',
                            top: '12px',
                            right: '24px',
                            border: '2px solid #ffffff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100
                        }}
                    >
                        X
                    </button>
                </div>
                <div className="xs:max-lg:mb-4 lg:overflow-y-scroll lg:max-h-[500px] xs:max-lg:w-full p-0 gig-modal-header flex flex-col w-1/2 border-r-2 border-white xs:max-lg:border-0">
                    <h1>{props.clientName}</h1>
                    <p className="modal-text mb-4">
                        {props.clientBio}
                    </p>
                    <div className="modal-text mb-2">
                        <span>Contact Information</span>
                        <div className="flex mb-2" style={{
                            alignItems: "center"
                        }}>
                            <span className="mr-2"><b>Email: </b></span><p>{props.clientEmail.length !== 0 ? props.clientEmail : "Edit client to enter an email address."}</p>
                        </div>

                    </div>
                    <div className="modal-text mb-4">
                        <span>How did you connect?</span>
                        <p>{props.clientConnection.length !== 0 ? props.clientConnection : `Edit client to enter how you personally connected- personal connections are great leverage for landing a conversion, and maintaining long-term conversions!`}</p>
                    </div>
                    <div className="modal-text">
                        <span>Order History</span>
                        <div className="flex justify-evenly">
                            <div>
                                <p className="mb-2 mt-2">Total Orders: {clientOrders.length}</p>
                                <p className="mb-2 mt-2">Pending Orders: {pendingOrders.length}</p>
                            </div>
                            <div>
                                <p className="mb-2 mt-2">Active Orders: {activeOrders.length}</p>
                                <p className="mb-2 mt-2">Fulfilled Orders: {fulfilledOrders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-text">
                        <span>Payment History</span>
                        {clientOrders.length > 0 &&
                            <table className="w-full mt-2">
                                <thead className="table-head text-center">
                                    <tr>
                                        <th>Payment Date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {clientOrders.map((order) => {
                                        return order.paymentRecord.map((rec, idx) => {
                                            if (rec[1] === 0) { return; }
                                            else {
                                                return (
                                                    <tr className="bg-opacity-10 bg-gray-100 text-center">
                                                        <td className="py-2">{new Date(rec[0]).toLocaleDateString()}</td>
                                                        <td className="py-2">{currencyStringToSymbol(order.payment.currency)}{rec[1]}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    })}
                                </tbody>
                            </table>
                        }
                        {clientOrders.length === 0 &&
                            <div className="flex justify-evenly">
                                <p>Once your client has started making payments to you, you can see their full history here.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="md:p-4 xs:max-md:w-full w-1/2">
                    <h1 className="modal-text-header underline">Latest Order</h1>
                    {clientOrders.length > 0 &&
                        <>
                            <h1 className="modal-text-header">
                                {latestOrder.serviceTitle}
                            </h1>
                            <p className="modal-text mb-4">
                                {latestOrder.serviceDescription}
                            </p>
                            <div className="modal-text flex-col mb-12">
                                <div className="flex modal-text">
                                    <span className="mr-2">Pricing: </span>
                                    <p className="mr-6">{currencyStringToSymbol(latestOrder.payment.currency)}{latestOrder.payment.price} {latestOrder.payment.pay_struct}</p>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex modal-text">
                                        <span className="mr-2">Amount Owed: </span>
                                        {!latestOrder.order_status.pending && <p>{currencyStringToSymbol(latestOrder.payment.currency)}{Number(latestOrder.payment.amountOwed).toFixed(2)}</p>}
                                        {latestOrder.order_status.pending === 1 && <p>Amount owed can be viewed once the order is active.</p>}
                                    </div>
                                    <div className="flex modal-text">
                                        <span className="mr-2">Amount Paid: </span>
                                        {!latestOrder.order_status.pending && <p>{currencyStringToSymbol(latestOrder.payment.currency)}{Number(latestOrder.payment.amountPaid).toFixed(2)}</p>}
                                        {latestOrder.order_status.pending === 1 && <p>Amount paid can be viewed once the order is active.</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="btn-submit w-1/3 self-end" style={{
                                    width: '45%'
                                }} onClick={() => { setCurrentModal('addOrderModal') }}>+ Assign Order</button>
                                <button className="btn-submit w-1/3 self=end" style={{ width: '45%' }}
                                    onClick={() => {
                                        setCurrentModal("paymentModal")
                                    }}>+ Add Payment</button>
                            </div>
                        </>
                    }
                    {clientOrders.length === 0 &&
                        <div style={{ padding: '24px' }}>
                            <p className="modal-text mb-4">Client has not placed an order, try reaching
                                out and see if you can land a conversion!</p>
                            <p className="modal-text mb-8">
                                To add an order, click the "Add Order" button below. Adding
                                orders from clients will allow you to use the amazing freelance tracking tools
                                Lance.IO provides to help you keep track of your freelance business.
                            </p>
                            <div className="flex gap-4">
                                <button className="btn-submit w-1/3 self-end" onClick={() => { setCurrentModal('addOrderModal') }}>+ Assign Order</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )

}
