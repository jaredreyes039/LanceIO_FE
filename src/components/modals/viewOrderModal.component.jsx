'async'

import { useContext, useEffect, useRef, useState } from "react";
import { modalContext } from "../../providers/modal.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import Cookies from 'universal-cookie';
import PendingPlanForm from "../forms/pendingPlan.forms";
import ActivePlanForm from "../forms/activePlan.forms";
import FulfilledPlanForm from "../forms/fulfilledPlan.forms";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";

export default function ViewOrderModal(props) {

    const { toast } = props;

    // NECESSARY FOR REFRESH REQS    
    let cookies = new Cookies(null, { path: '/' })
    const userId = cookies.get('user_id')
    const token = cookies.get('token')


    const [currentOrderData, setCurrentOrderData] = useState({
        _id: '',
        order_status: {
            pending: 0,
            active: 0,
            completed: 0,
            cancelled: 0
        },
        payment: {
            price: 0,
            currency: '',
            pay_struct: '',
            amountOwed: 0
        },
        clientRequests: '',
        orderRequirements: '',
        additionalNotes: ''
    });
    const { currentModal, setCurrentModal, modalData, orderModalFormView, setOrderModalFormView } = useContext(modalContext)
    const { clientData, refreshOrderData, orderData } = useContext(serviceDataContext)
    const [currentClient, setCurrentClient] = useState(clientData)
    const [orderStatusSlider, setOrderStatusSlider] = useState(null)

    let order = modalData.order
    const orderService = modalData.service

    const viewOrderModal = useRef();
    const sliderBtn = useRef();

    useEffect(() => {
        if (orderData.length > 0) {
            order = orderData.filter((order) => { return order._id === modalData.order._id })[0]
        }
    }, [orderData, modalData])

    // Order status updated with slider GUI
    const updateOrderStatus = async (e, slider) => {
        let status;
        if (slider !== orderStatusSlider) {
            e.preventDefault();
            setOrderStatusSlider(slider)
            switch (slider) {
                case 0:
                    status = {
                        pending: 1,
                        active: 0,
                        completed: 0,
                        cancelled: 0
                    }
                    break;
                case 1:
                    status = {
                        pending: 0,
                        active: 1,
                        completed: 0,
                        cancelled: 0
                    }
                    break;
                case 2:
                    status = {
                        pending: 0,
                        active: 0,
                        completed: 1,
                        cancelled: 0
                    }
                    break;
                case 3:
                    status = {
                        pending: 0,
                        active: 0,
                        completed: 0,
                        cancelled: 1
                    }
                    break;
                default:
                    status = {
                        pending: 1,
                        active: 0,
                        completed: 0,
                        cancelled: 0
                    }
                    break;
            }
            const response = await fetch('http://localhost:5001/api/orders/updateOrder/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: currentOrderData._id,
                    service_id: currentOrderData.service_id,
                    status: status,
                    token: token
                })
            })
            const data = await response.json()
            if (data) {
                refreshOrderData(userId, token)
            }
        }
        else {
            return;
        }
    }

    // Update current status with slider
    async function updateDataAndSlider() {
        setCurrentOrderData(modalData.order)
        let currentStatus = Object.keys(modalData.order.order_status).find(key => modalData.order.order_status[key] === 1);
        switch (currentStatus) {
            case 'pending':
                sliderBtn.current.style.left = "0px";
                setOrderModalFormView(0)
                break;
            case 'active':
                sliderBtn.current.style.left = "25%";
                setOrderModalFormView(1)

                break;
            case 'completed':
                sliderBtn.current.style.left = "50%";
                setOrderModalFormView(2)

                break;
            case 'cancelled':
                sliderBtn.current.style.left = "75%";
                setOrderModalFormView(3)

                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (clientData.length !== 0 && modalData.order.client_id !== undefined) {
            setCurrentClient(clientData.filter((client) => { return client._id === modalData.order.client_id })[0])
        }
    }, [modalData.order, clientData, modalData.order.client_id])

    useEffect(() => {
        switch (orderStatusSlider) {
            case 0:
                sliderBtn.current.style.left = "0px";
                setOrderModalFormView(0)
                break;
            case 1:
                sliderBtn.current.style.left = "25%";
                setOrderModalFormView(1)

                break;
            case 2:
                sliderBtn.current.style.left = "50%";
                setOrderModalFormView(2)

                break;
            case 3:
                sliderBtn.current.style.left = "75%";
                setOrderModalFormView(3)

                break;
            default:
                break;
        }
    }, [orderStatusSlider])

    useEffect(() => {
        switch (currentOrderData.order_status) {
            case { pending: 1, active: 0, completed: 0, cancelled: 0 }:
                setOrderStatusSlider(0)
            case { pending: 0, active: 1, completed: 0, cancelled: 0 }:
                setOrderStatusSlider(1)
            case { pending: 0, active: 0, completed: 1, cancelled: 0 }:
                setOrderStatusSlider(2)
            case { pending: 0, active: 0, completed: 0, cancelled: 1 }:
                setOrderStatusSlider(3)
        }
    }, [currentOrderData])

    useEffect(() => {
        if (currentModal === 'viewOrderModal') {
            viewOrderModal.current.classList.remove('modal-hidden')
            viewOrderModal.current.classList.add('modal-visible')
        }
        else {
            viewOrderModal.current.classList.remove('modal-visible')
            viewOrderModal.current.classList.add('modal-hidden')
        }
    }, [currentModal])

    useEffect(() => {
        updateDataAndSlider()
    }, [])

    return (
        <>
            <div ref={viewOrderModal} className="modal-container modal-hidden">
                <div className="close-modal-btn">
                    <button onClick={() => {
                        setCurrentModal("");
                    }}
                        style={{
                            color: "#ffffff",
                            fontSize: "12pt",
                            fontWeight: "bold",
                            backgroundColor: "transparent",
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            border: '2px solid #ffffff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        X
                    </button>
                </div>
                <div className="modal-header p-4" style={{ height: '90%' }}>
                    <h1>{orderService.title !== undefined ? orderService.title : ""}</h1>
                    <div style={{ height: 'inherit', overflowY: 'scroll', overflowX: 'hidden' }}>
                        <div className="modal-text mb-4">
                            <div className="modal-text flex gap-2">
                                <span>Order #</span>
                                <p>
                                    {currentOrderData.order_num ? currentOrderData.order_num : currentOrderData._id}
                                </p>
                            </div>
                            <div className="modal-text flex gap-2 mb-4">
                                <span>Service:</span>
                                <p>
                                    {orderService.title}
                                </p>
                            </div>
                            <div className="modal-text mb-4" style={{
                                width: '95%'
                            }}>
                                <span>Service Description:</span>
                                <p>{orderService.description !== undefined ? orderService.description : ""}</p>
                            </div>
                            <div className="modal-text flex gap-2 mb-4">
                                <span>Client:</span>
                                <p>{currentClient.name ? currentClient.name : "Failed to display client data, please try again later."}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Price:</span>
                                <p>{currencyStringToSymbol(currentOrderData.payment.currency)}{currentOrderData.payment.price} {currentOrderData.payment.pay_struct}</p>
                            </div>
                            <div className="modal-text flex gap-2">
                                <span>Amount Owed:</span>
                                <p>{currencyStringToSymbol(currentOrderData.payment.currency)}{currentOrderData.payment.amountOwed.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="modal-text mb-4">
                            <div className="modal-text mb-4" style={{
                                width: '95%'
                            }}>
                                <span>Client Requests:</span>
                                <p>{order.clientRequests}</p>
                            </div>
                            <div className="modal-text mb-4" style={{
                                width: '95%'
                            }}>
                                <span>Order Requirements:</span>
                                <p>{order.orderRequirements}</p>
                            </div>
                            <div className="modal-text mb-4" style={{
                                width: '95%'
                            }}>
                                <span>Notes:</span>
                                <p>{order.additionalNotes}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-body pt-8" style={{
                    position: 'relative',
                }}>
                    <div className="slider-btn-container" style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                    }}>
                        <div className="slider-btn-background" style={{ width: '90%' }}>
                            <div ref={sliderBtn} className="slider-btn" style={{ width: '25%' }}></div>
                            <div onClick={(e) => { updateOrderStatus(e, 0) }} className="basis-1/4 text-center relative z-10">
                                <p>Pending</p>
                            </div>
                            <div onClick={(e) => { updateOrderStatus(e, 1) }} className="basis-1/4 text-center relative z-10">
                                <p>Active</p>
                            </div>
                            <div onClick={(e) => { updateOrderStatus(e, 2) }} className="basis-1/4 text-center relative z-10">
                                <p>Fulfilled</p>
                            </div>
                            <div onClick={(e) => { updateOrderStatus(e, 3) }} className="basis-1/4 text-center relative z-10">
                                <p>Cancelled</p>
                            </div>
                        </div>
                    </div>

                    <PendingPlanForm toast={toast} display={orderModalFormView === 0 ? "flex" : "none"} userId={userId} orderData={order} orderId={order._id} token={token} />
                    <ActivePlanForm toast={toast} display={orderModalFormView === 1 ? "flex" : "none"} userId={userId} orderData={order} token={props.token} orderId={order._id} />
                    {orderModalFormView === 2 ? <FulfilledPlanForm toast={toast} token={props.token} order={order}></FulfilledPlanForm> : <></>}
                    {orderModalFormView === 3 ? <></> : <></>}
                </div>
            </div>
        </>
    )
}
