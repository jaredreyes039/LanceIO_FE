import { useContext, useEffect, useState } from "react";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import { modalContext } from "../../../providers/modal.provider";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";


export default function UpcomingDelivery(props) {

    const { setCurrentModal, setModalData } = useContext(modalContext)
    const { clientData, serviceData, orderData } = useContext(serviceDataContext)

    const [upcomingDels, setUpcomingDels] = useState([])

    // Display effect
    useEffect(() => {
        let orderDataCopy = [...orderData]
        // Currently set < 7 days
        let filteredDeliveries = orderDataCopy.filter(
            (order) => {
                let daysDiff = Math.round((new Date(order.deliveryDate) - Date.now()) / (1000 * 60 * 60 * 24))
                console.log("difference:" + daysDiff)
                if (daysDiff <= 7 && daysDiff > 0) {
                    return order
                }

            }
        )
        // Add service title and client name to orders
        for (let i = 0; i < filteredDeliveries.length; i++) {
            filteredDeliveries[i].serviceTitle = serviceData.filter(service => service._id === filteredDeliveries[i].service_id)[0].title
            filteredDeliveries[i].clientName = clientData.filter(client => client._id === filteredDeliveries[i].client_id)[0].name
        }
        setUpcomingDels(filteredDeliveries)
    }, [orderData, serviceData, clientData])

    // Order viewing
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

    return (
        <>
            {upcomingDels && clientData && serviceData &&
                <ul>
                    {upcomingDels.map((order) => {
                        return (
                            <li className="order-list-item w-full"
                                onClick={(e) => { openViewOrderModal(e) }}
                                id={order._id}
                                key={order._id}
                            >
                                <div className="order-list-item-header">
                                    <h1>{order.serviceTitle}</h1>
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
                                        <p>{currencyStringToSymbol(order.payment.currency)} {order.payment.amountOwed} {order.payment.pay_struct}</p>
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
