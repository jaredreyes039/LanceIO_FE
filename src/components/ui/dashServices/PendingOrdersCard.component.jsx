import { useContext, useEffect, useState } from "react"
import { modalContext } from "../../../providers/modal.provider";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";


export default function OrdersCard(props) {

    const { setCurrentModal, setModalData } = useContext(modalContext)
    const { clientData, serviceData, orderData } = useContext(serviceDataContext)

    const [pendingOrders, setPendingOrders] = useState([])
    const [activeOrders, setActiveOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])

    const openViewOrderModal = (e) => {
        if (serviceData.length > 0) {
            let order = orderData.filter((order) => { return order._id === e.currentTarget.id })[0]
            let service = serviceData.filter((service) => { return service._id === order.service_id })[0]
            setCurrentModal('viewOrderModal')
            setModalData({
                order: order,
                service: service
            })
        }
    }

    function getPendingOrders(orders) {
        let pendingOrdersFilter = orders.filter((order) => { return order.order_status.pending === 1 })
        return pendingOrdersFilter
    }

    function getActiveOrders(orders) {
        let activeOrdersFilter = orders.filter((order) => { return order.order_status.active === 1 })
        return activeOrdersFilter
    }
    function getCompletedOrders(orders) {
        let completedOrdersFilter = orderData.filter((order) => { return order.order_status.completed === 1 })
        return completedOrdersFilter;
    }

    function sortOrders(orderData) {
        let updatedPendingOrders = getPendingOrders(orderData)
        let updatedActiveOrders = getActiveOrders(orderData)
        let updatedCompletedOrders = getCompletedOrders(orderData)
        // Copy state to update
        let pendingCopy = [...pendingOrders]
        let activeCopy = [...activeOrders]
        let completedCopy = [...completedOrders]
        // Easiest to just remove all components and rewrite, might move to a reducer down the line
        pendingCopy.length = 0
        activeCopy.length = 0
        completedCopy.length = 0
        // Update copies
        updatedPendingOrders.forEach((order) => {
            pendingCopy.push(order)
        })
        updatedActiveOrders.forEach((order) => {
            activeCopy.push(order)
        })
        updatedCompletedOrders.forEach((order) => {
            completedCopy.push(order)
        })
        // Update states with new copys 
        setPendingOrders(pendingCopy)
        setActiveOrders(activeCopy)
        setCompletedOrders(completedCopy)
    }

    useEffect(() => {
        if (orderData) {
            sortOrders(orderData)
        }
    }, [orderData])

    useEffect(() => {

    }, [pendingOrders, activeOrders, completedOrders])

    return (
        <>
            {props.trackingType === 'pending' &&
                < div style={{ height: '240px' }}>
                    <div style={{ display: pendingOrders.length > 0 ? 'block' : 'none' }} className="container-scroll">
                        <ul className="order-list">
                            {serviceData.length > 0 && clientData.length > 0 && pendingOrders.map((order, idx) => {

                                let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                                let clientName = clientData.filter(client => client._id === order.client_id)[0]
                                serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                                clientName = clientName.name ? clientName.name : ""

                                return (
                                    <li className="order-list-item w-full"
                                        onClick={(e) => { openViewOrderModal(e) }}
                                        id={order._id}
                                        key={order._id}

                                    >
                                        <div className="order-list-item-header">
                                            <h1>{serviceTitle}</h1>
                                            <p className="modal-text">Order #{order.order_num}</p>
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
                                                <p>{currencyStringToSymbol(order.payment.currency)}{order.payment.amountOwed.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div style={{ display: pendingOrders.length > 0 ? 'none' : 'block' }} className="no-orders-container">
                        <div className="flex flex-col justify-center items-center w-full p-12">
                            <h1 className="text-primaryWhite mb-8 ">0 Orders Pending</h1>
                            <p className="text-primaryWhite ">
                                You currently have no pending orders.
                            </p>
                        </div>
                    </div>
                </div>
            }
            {
                props.trackingType === 'active' &&
                <div style={{ height: '240px' }}>
                    <div style={{ display: activeOrders.length > 0 ? 'block' : 'none' }} className="container-scroll">
                        <ul className="order-list">
                            {serviceData.length > 0 && clientData.length > 0 && activeOrders.map((order, idx) => {
                                let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                                let clientName = clientData.filter(client => client._id === order.client_id)[0]
                                serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                                clientName = clientName.name ? clientName.name : ""

                                return (
                                    <li className="order-list-item w-full"
                                        onClick={(e) => { openViewOrderModal(e) }}
                                        id={order._id}
                                        key={order._id}
                                    >
                                        <div className="order-list-item-header">
                                            <h1>{serviceTitle}</h1>
                                            <p className="modal-text">Order #{order.order_num}</p>
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
                                                <p>{currencyStringToSymbol(order.payment.currency)}{order.payment.amountOwed.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div style={{ display: activeOrders.length > 0 ? 'none' : 'block' }} className="no-orders-container">
                        <div className="flex flex-col justify-center items-center w-full p-12">
                            <h1 className="text-primaryWhite mb-8">0 Orders Active</h1>
                            <p className="text-primaryWhite ">
                                You currently have no active orders.
                            </p>
                        </div>
                    </div>
                </div >
            }
            {
                props.trackingType === 'completed' &&
                <div style={{ height: props.home ? '200px' : '240px' }}>
                    <div style={{ display: completedOrders.length > 0 ? 'block' : 'none' }} className="container-scroll">
                        <ul className="order-list">
                            {serviceData.length > 0 && clientData.length > 0 && completedOrders.map((order, idx) => {

                                let serviceTitle = serviceData.filter(service => service._id === order.service_id)[0]
                                let clientName = clientData.filter(client => client._id === order.client_id)[0]
                                serviceTitle = serviceTitle.title ? serviceTitle.title : ""
                                clientName = clientName.name ? clientName.name : ""
                                return (
                                    <li className="order-list-item w-full"
                                        onClick={(e) => { openViewOrderModal(e) }}
                                        id={order._id}
                                        key={order._id}

                                    >
                                        <div className="order-list-item-header">
                                            <h1>{serviceTitle}</h1>
                                            <p className="modal-text">Order #{order.order_num}</p>
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
                                                <p>{currencyStringToSymbol(order.payment.currency)}{order.payment.amountOwed.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div style={{ display: completedOrders.length > 0 ? 'none' : 'block' }} className="no-orders-container">
                        <div className="flex flex-col justify-center items-center w-full p-12">
                            <h1 className="text-primaryWhite mb-8">0 Orders Fulfilled</h1>
                            <p className="text-primaryWhite ">
                                You currently have no fulfilled orders.
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
