import { isEmpty } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { modalContext } from "../../providers/modal.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";
import AddPaymentForm from "../forms/addPayment.form";
import ModalContainer from "../ui/modals/ModalContainer.component";


export default function PaymentModal(props) {
    const { toast } = props;

    const { orderData, serviceData, clientData } = useContext(serviceDataContext)
    const { currentModal, setCurrentModal } = useContext(modalContext)
    const [isOpen, setIsOpen] = useState(props.isOpen)
    const [paymentPhase, setPaymentPhase] = useState(0)
    const [orderItems, setOrderItems] = useState([])
    const [currentOrder, setCurrentOrder] = useState({})
    const [currentOrderComp, setCurrentOrderComp] = useState(null)
    const paymentModal = useRef()

    useEffect(() => {
        if (currentModal === "paymentModal") {
            setIsOpen(true)
        }
    }, [currentModal])

    useEffect(() => {
        if (isOpen) {
            let orderInfo = orderData.map((order) => {
                return {
                    orderId: order._id,
                    serviceId: order.service_id,
                    clientId: order.client_id,
                    serviceTitle: "",
                    clientName: "",
                    currency: order.payment.currency,
                    amountOwed: order.payment.amountOwed.toFixed(2),
                    amountPaid: order.payment.amountPaid.toFixed(2),
                    deliveryDate: order.deliveryDate,
                    paymentDatePref: order.paymentDatePref,
                    paymentDates: order.paymentDates ? order.paymentDates : [],
                }
            })
            orderInfo.forEach((order) => {
                let service = serviceData.filter((service) => service._id === order.serviceId)
                let client = clientData.filter((client) => client._id === order.clientId)
                order.serviceTitle = service[0].title
                order.clientName = client[0].name
            })
            let orderItemsCopy = [...orderItems]
            orderItemsCopy.length = 0;
            orderInfo.forEach((order) => {
                orderItemsCopy.push(order)
            })
            setOrderItems(orderItemsCopy)
        }
    }, [isOpen, orderData, serviceData, clientData])

    useEffect(() => {
        if (isOpen) {
            paymentModal.current.classList.remove('modal-hidden')
            paymentModal.current.classList.add('modal-visible')
        }
        else {
            paymentModal.current.classList.remove('modal-visible')
            paymentModal.current.classList.add('modal-hidden')
        }
    }, [isOpen])

    const handleOrderSelection = (e) => {
        if (Object.keys(currentOrder).length > 0) {
            currentOrderComp.className = currentOrderComp.className.replace(' selected-service', '')
            e.currentTarget.className += ' selected-service'
            let selectedOrder = orderItems.filter((order) => { return order.orderId === e.currentTarget.id })
            selectedOrder = selectedOrder[0]
            setCurrentOrder(selectedOrder)
            setCurrentOrderComp(e.currentTarget)
        }
        else {
            e.currentTarget.className += ' selected-service'
            let selectedOrder = orderItems.filter((order) => { return order.orderId === e.currentTarget.id })
            selectedOrder = selectedOrder[0]
            setCurrentOrder(selectedOrder)
            setCurrentOrderComp(e.currentTarget)
        }
    }

    const handleCloseModal = async () => {
        setCurrentModal("")
    }

    return (
        <>
            <div className="modal-hidden" ref={paymentModal}>
                <ModalContainer closeHandler={handleCloseModal}>
                    <div className="xs:max-lg:mb-4 lg:overflow-y-scroll lg:max-h-[500px] xs:max-lg:w-full p-0 gig-modal-header flex flex-col w-1/2 border-r-2 border-white xs:max-lg:border-0">
                        <h1>Payment Modal</h1>
                        <div className="modal-text mb-4">
                            <p>Welcome to the final step of LanceIO's tracking process- adding and tracking your clients' payments! With a simple form, it's
                                never been easier to maintain a simple, clear, and concise record of income from your freelancing work.
                            </p>
                        </div>
                        {!isEmpty(currentOrder) && <h1 style={{ marginBottom: '12px' }}>Selected Order</h1>}
                        {!isEmpty(currentOrder) && <div className="mb-2 flex flex-col">
                            <div className="modal-text flex gap-2">
                                <span>Service:</span>
                                <p>{currentOrder.serviceTitle}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Client:</span>
                                <p>{currentOrder.clientName}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Amount Owed:</span>
                                <p>{currencyStringToSymbol(currentOrder.currency)}{currentOrder.amountOwed}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Amount Paid</span>
                                <p>{currencyStringToSymbol(currentOrder.currency)}{currentOrder.amountPaid}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Last Payment:</span>
                                <p>{currencyStringToSymbol(currentOrder.currency)}{currentOrder.amountPaid}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Last Payment Date:</span>
                            </div>
                        </div>}
                    </div>
                    <div className="gig-modal-body pl-12 w-1/2 xs:max-lg:w-full flex flex-col xs:max-lg:pl-0">
                        <div style={{ height: '100%', display: paymentPhase === 0 ? 'flex' : 'none' }} className="flex flex-col p-2">
                            <div className="modal-text">
                                <span>1. Select an Order</span>
                            </div>
                            <div className="modal-scroll-box mb-8">
                                {orderItems.length > 0 &&
                                    <>
                                        {orderItems.map((order, index) => {
                                            return (
                                                <li style={{ listStyle: 'none' }} id={order.orderId} onClick={(e) => { handleOrderSelection(e) }} className="p-2 gig-planner-item" key={order._id}>
                                                    <h1 className="modal-text mb-2 underline">
                                                        {order.serviceTitle}
                                                    </h1>
                                                    <div className="modal-text mb-2">
                                                        <span>Client: </span><p>{order.clientName}</p>
                                                    </div>
                                                    <div className="modal-text mb-2">
                                                        <span>Delivery Date:</span>
                                                        <p>{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                                        <span>Expected Payment Date</span>
                                                        <p>{new Date(order.paymentDatePref).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <span className="price-label"></span>
                                                        <p className="modal-text">
                                                            Amount Owed: {currencyStringToSymbol(order.currency)}{order.amountOwed}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <span className="price-label"></span>
                                                        <p className="modal-text">
                                                            Amount Paid: {currencyStringToSymbol(order.currency)}{order.amountPaid}
                                                        </p>
                                                    </div>

                                                </li>
                                            )
                                        })}
                                    </>
                                }
                                {orderItems.length === 0 &&
                                    <>
                                        <p className="modal-text mb-4">
                                            You don't have any fulfilled orders yet, once you've added and fulfilled an order it will appear here for you to add payments made by the client.
                                        </p>
                                    </>
                                }
                            </div>
                            <button onClick={() => { setPaymentPhase(1) }} disabled={isEmpty(currentOrder) ? 1 : 0} className="btn-submit w-1/3 self-end">Next Step</button>
                        </div>
                        <div style={{ height: '100%', display: paymentPhase === 1 ? 'flex' : 'none' }} className="flex flex-col p-2">
                            {!isEmpty(currentOrder) && <AddPaymentForm toast={toast} client_id={currentOrder.clientId} token={props.token} orderId={currentOrder.orderId} userId={props.userId} />}
                        </div>
                    </div>
                </ModalContainer>
            </div>
        </>
    )
}
