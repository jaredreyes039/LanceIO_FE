import { useContext, useEffect, useState } from "react";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import { modalContext } from "../../../providers/modal.provider";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";
import LoadingIcon from "../cards/LoadingIcon.component";


export default function UpcomingDelivery(props) {

    const { setCurrentModal, setModalData } = useContext(modalContext)
    const { clientData, serviceData, orderData } = useContext(serviceDataContext)

    const [isLoading, setIsLoading] = useState(true)
    const [showErrMsg, setShowErrMsg] = useState(true)
    const [upcomingDels, setUpcomingDels] = useState([])

    // Display effect
    useEffect(() => {
        try {
            let orderDataCopy = [...orderData]
            // Currently set < 7 days
            let filteredDeliveries = orderDataCopy.filter(
                (order) => {
                    let daysDiff = Math.round((new Date(order.deliveryDate) - Date.now()) / (1000 * 60 * 60 * 24))
                    if (daysDiff <= 14 && daysDiff > 0) {
                        return order
                    }

                }
            )
            // Add service title and client name to orders
            for (let i = 0; i < filteredDeliveries.length; i++) {
                if (serviceData.length > 0 && clientData.length > 0) {
                    filteredDeliveries[i].serviceTitle = serviceData.filter(service => service._id === filteredDeliveries[i].service_id)[0].title
                    filteredDeliveries[i].clientName = clientData.filter(client => client._id === filteredDeliveries[i].client_id)[0].name
                }
            }
            setIsLoading(false)
            setUpcomingDels(filteredDeliveries)
        }
        catch (err) {
            setIsLoading(false)
            setShowErrMsg(true)
        }
    }, [orderData, serviceData, clientData])

    // Order viewing
    const openViewOrderModal = (e) => {
        if (serviceData.length > 0 && orderData.length > 0) {
            let order = orderData.filter((order) => { return order._id === e.currentTarget.id })[0]
            let service = serviceData.filter((service) => { return service._id === order.service_id })[0]
            setCurrentModal('viewOrderModal')
            setModalData({
                order: order,
                service: service
            })
        }
    }

    if (upcomingDels.length > 0 && !isLoading) {
        return (
            <>
                {upcomingDels && clientData && serviceData &&
                    <ul className="container-scroll">
                        {upcomingDels.map((order) => {
                            return (
                                <li className="order-list-item w-full"
                                    onClick={(e) => { openViewOrderModal(e) }}
                                    id={order._id}
                                    key={order._id}
                                >
                                    <div className="order-list-item-header">
                                        <h1>{order.serviceTitle}</h1>
                                        <p className="modal-text">Order #{order.order_num}</p>
                                    </div>
                                    <div className="order-list-item-body flex justify-around w-full">
                                        <div>
                                            <span>Client: </span>
                                            <p>{order.clientName}</p>
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
                }
            </>
        )
    }
    else if (upcomingDels.length === 0 && !isLoading) {
        return (
            <>
                <div className="card-item-placeholder-header">
                    <h1 className="mb-2 underline">
                        Add orders to your clients to see when they are due to deliver...
                    </h1>
                    <p className="modal-text mb-2 desc">
                        Tracking your orders has never been easier, with a quick reference
                        table for all of your upcoming deliveries!
                    </p>
                </div>
            </>
        )
    }
    else if (!showErrMsg) {
        return (
            <div className="w-full h-36 flex items-center justify-center">
                <LoadingIcon />
            </div>
        )
    }
    else {
        return (
            <div className="w-full h-36 flex items-center justify-center">
                <p className="modal-text desc">
                    Failed to retrieve delivery data, please try again later. If this problem persists, contact us through Github.
                </p>
            </div>
        )
    }
}
