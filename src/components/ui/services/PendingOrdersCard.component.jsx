import { useContext, useEffect, useState } from "react"
import { modalContext } from "../../../providers/modal.provider";
import ViewOrderModal from "../../modals/viewOrderModal.component";
import { serviceDataContext } from "../../../providers/servicesData.provider";


export default function OrdersCard(props){

    
    const { setCurrentModal, setModalData } = useContext(modalContext)
    const {clientData, serviceData, orderData} = useContext(serviceDataContext)

    const [pendingOrders, setPendingOrders] = useState([])
    const [activeOrders, setActiveOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])

    const openViewOrderModal = (e) => {
        if(serviceData.length > 0){
            let order = orderData.filter((order)=>{return order._id === e.currentTarget.id})[0]
            let service = serviceData.filter((service)=>{return service._id === order.service_id})[0]
            setCurrentModal('viewOrderModal')
            setModalData({
                order: order,
                service: service
            })
        }
    }

    function sortOrders(orderData){
        let pendingOrdersFilter = orderData.filter((order)=>{return order.order_status.pending === 1})
        let activeOrdersFilter = orderData.filter((order)=>{return order.order_status.active === 1})
        let completedOrdersFilter = orderData.filter((order)=>{return order.order_status.completed === 1})

        setPendingOrders(pendingOrdersFilter)
        setActiveOrders(activeOrdersFilter)
        setCompletedOrders(completedOrdersFilter)
    }

    useEffect(()=>{
        if(orderData.length > 0){
            console.log(orderData)
            sortOrders(orderData)
        }
    }, [orderData])



    return (
        <>
            {props.trackingType === 'pending' &&
                <div>
                <div style={{display: pendingOrders.length > 0 ? 'block' : 'none'}} className="order-container-scroll">
                    <ul className="order-list">
                        {pendingOrders.map((order, idx)=>{

                            let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                            let clientName = clientData.filter(client => client._id === order.client_id)[0]
                            serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                            clientName = clientName.name ? clientName.name : ""
                                
                            return (
                                <li className="order-list-item w-full"
                                    onClick={(e)=>{openViewOrderModal(e)}}
                                    id={order._id}
                                    key={order._id}

                                >
                                    <div className="order-list-item-header">
                                        <h1>{serviceTitle}</h1>
                                    </div>
                                    <div className="order-list-item-body flex justify-around w-full">
                                        <div>
                                        <span>Client: </span>
                                        <p>{clientName}</p>
                                        </div>
                                        <div>
                                            <span>Delivery Date</span>
                                            <p className="text-primaryWhite">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                        <span>Expected Income: </span>
                                        <p>{order.payment.amountOwed} {order.payment.currency} {order.payment.pay_struct}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div style={{display: pendingOrders.length > 0 ? 'none' : 'block'}} className="no-orders-container">
                    <div className="flex flex-col justify-center items-center w-full p-12">
                        <h1 className="text-primaryWhite mb-8">0 Orders Pending</h1>
                        <p className="text-primaryWhite">
                            You currently have no pending orders,
                            to start tracking and managing client orders, select a client
                            from your client contacts and add an order to their profile.
                        </p>
                    </div>
                </div>
                </div>  
            }
            {props.trackingType === 'active' && 
                <div>
                    <div style={{display: activeOrders.length > 0 ? 'block' : 'none'}} className="order-container-scroll">
                            <ul className="order-list">
                                {activeOrders.map((order, idx)=>{
                                    let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                                    let clientName = clientData.filter(client => client._id === order.client_id)[0]
                                    serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                                    clientName = clientName.name ? clientName.name : ""

                                    return (
                                        <li className="order-list-item w-full"
                                        onClick={(e)=>{openViewOrderModal(e)}}
                                        id={order._id}
                                        key={order._id}
                                        >
                                            <div className="order-list-item-header">
                                                <h1>{serviceTitle}</h1>
                                            </div>
                                            <div className="order-list-item-body flex justify-around w-full">
                                                <div>
                                                <span>Client: </span>
                                                <p>{clientName}</p>
                                                </div>
                                                <div>
                                                    <span>Delivery Date</span>
                                                    <p className="text-primaryWhite">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                <span>Expected Income: </span>
                                                <p>{order.payment.amountOwed} {order.payment.currency} {order.payment.pay_struct}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div style={{display: activeOrders.length > 0 ? 'none' : 'block'}} className="no-orders-container">
                            <div className="flex flex-col justify-center items-center w-full p-12">
                                <h1 className="text-primaryWhite mb-8">0 Orders Active</h1>
                                <p className="text-primaryWhite">
                                    You currently have no active orders,
                                    to mark an order as active, select a pending order
                                    and select 'Promote to Active'.
                                </p>
                            </div>
                        </div>
                </div>
            }
            {props.trackingType === 'completed' && 
                <div>
                    <div style={{display: completedOrders.length > 0 ? 'block' : 'none'}} className="order-container-scroll">
                            <ul className="order-list">
                                {completedOrders.map((order, idx)=>{
            
                                    let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                                    let clientName = clientData.filter(client => client._id === order.client_id)[0]
                                    serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                                    clientName = clientName.name ? clientName.name : ""
                                    return (
                                        <li className="order-list-item w-full"
                                        onClick={(e)=>{openViewOrderModal(e)}}
                                        id={order._id}
                                        key={order._id}

                                        >
                                            <div className="order-list-item-header">
                                                <h1>{serviceTitle}</h1>
                                            </div>
                                            <div className="order-list-item-body flex justify-around w-full">
                                                <div>
                                                <span>Client: </span>
                                                <p>{clientName}</p>
                                                </div>
                                                <div>
                                                    <span>Delivery Date</span>
                                                    <p className="text-primaryWhite">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                <span>Expected Income: </span>
                                                <p>{order.payment.amountOwed} {order.payment.currency} {order.payment.pay_struct}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div style={{display: completedOrders.length > 0 ? 'none' : 'block'}} className="no-orders-container">
                            <div className="flex flex-col justify-center items-center w-full p-12">
                                <h1 className="text-primaryWhite mb-8">0 Orders Fulfilled</h1>
                                <p className="text-primaryWhite">
                                    You currently have no active orders,
                                    to mark an order as fulfilled, select an active order
                                    then select 'Fullfill Order' and fill out our fulfillment form.
                                </p>
                            </div>
                        </div>
                </div>
            }
        </>
    )
}