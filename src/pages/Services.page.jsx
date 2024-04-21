import { useContext, useEffect, useRef, useState } from "react";
import ToolBar from "../layouts/Toolbar.component";
import CardItemBlack from "../components/ui/cards/CardItemBlack.component";
import PageBodyLayout from "../layouts/PageBody.layout";
import Cookies from "universal-cookie";
import ClientsCard from "../components/ui/dashServices/ClientsCard.component";
import OrdersCard from "../components/ui/dashServices/PendingOrdersCard.component";
import { modalContext } from "../providers/modal.provider";
import { serviceDataContext } from "../providers/servicesData.provider";
import ViewOrderModal from "../components/modals/viewOrderModal.component";
import ServiceManager from "../components/ui/dashServices/ServiceManager.component";
import UpcomingDelivery from "../components/ui/dashServices/UpcomingDelivery.component";
import RecentInvoices from "../components/ui/dashServices/RecentInvoices.component";
import PaymentModal from "../components/modals/PaymentModal.component";
import { ToastContainer, toast } from "react-toastify";

export default function Services(props) {

    let cookies = new Cookies(null, { path: "/" });
    let user_id = cookies.get("user_id");
    let token = cookies.get("token");

    const { currentModal } = useContext(modalContext);
    const {
        serviceData,
        getServiceData,
        getOrderData,
        getClientData,
        orderData
    } = useContext(serviceDataContext);

    // VIEW STATES
    const [scrollEnabled, setScrollEnabled] = useState(true);

    // VIEW REFS
    const backdrop = useRef();

    useEffect(() => {
        if (currentModal.length > 0) {
            backdrop.current.classList.remove("hidden");
        }
        else {
            backdrop.current.classList.add("hidden");
        }
    }, [currentModal])

    useEffect(() => {
        getServiceData(user_id, token);
        getOrderData(user_id, token);
        getClientData(user_id)
    }, [])

    return (
        <>
            {currentModal === 'viewOrderModal' && <ViewOrderModal toast={toast} token={token} />}
            {currentModal === 'paymentModal' && <PaymentModal toast={toast} token={token} userId={user_id} />}
            <div className="backdrop" ref={backdrop}>
            </div>

            {/* Main Page */}
            <div className="flex">
                <ToolBar />
                <PageBodyLayout togglePageScroll={scrollEnabled}>
                    <div className="flex xs:max-xl:flex-col w-full gap-4 mb-4">
                        <div className="w-full">
                            <CardItemBlack
                                height="360px"
                                title="Upcoming Deliveries"
                                icon="./icons/DashboardIcon.svg"
                            >
                                <UpcomingDelivery />
                            </CardItemBlack>
                        </div>
                        <div className="w-full">
                            <CardItemBlack
                                height="360px"
                                title="Recent Invoices"
                                icon="./icons/DashboardIcon.svg"
                            >
                                <RecentInvoices />
                            </CardItemBlack>
                        </div>
                        <div className="w-full flex">
                            <CardItemBlack
                                width="100%"
                                height="360px"
                                title="Client Contacts"
                                icon="./icons/userIcon.svg"
                            >
                                <ClientsCard toast={toast} />
                            </CardItemBlack>
                        </div>
                    </div>
                    {/* Service Manager */}
                    <div className="mb-3 gap-3 flex">
                        <CardItemBlack
                            width="100%"
                            height="360px"
                            title="Service Manager"
                            icon="./icons/IncomeIcon.svg"
                        >
                            <div className="all-gigs-table-container">
                                <ServiceManager toast={toast} data={serviceData} />
                            </div>
                        </CardItemBlack>
                    </div>
                    <div className="gap-3 mb-3 flex xs:max-xl:flex-col">
                        <div className="w-1/2 xs:max-xl:w-full">
                            <CardItemBlack
                                width="100%"
                                height="360px"
                                title="Pending Orders"
                                icon="./icons/InvoiceIcon.svg"
                            >
                                {<OrdersCard toast={toast} orders={orderData} trackingType="pending" />}
                            </CardItemBlack>
                        </div>
                        <div className="w-1/2 xs:max-xl:w-full">
                            <CardItemBlack
                                width="100%"
                                height="360px"
                                title="Active Orders"
                                icon="./icons/InvoiceIcon.svg"
                            >
                                {<OrdersCard toast={toast} orders={orderData} trackingType="active" />}
                            </CardItemBlack>
                        </div>
                        <div className="w-1/2 xs:max-xl:w-full">
                            <CardItemBlack
                                width="100%"
                                height="360px"
                                title="Fulfilled Orders"
                                icon="./icons/InvoiceIcon.svg"
                            >
                                {<OrdersCard toast={toast} orders={orderData} trackingType="completed" />}
                            </CardItemBlack>
                        </div>
                    </div>
                </PageBodyLayout>
            </div>
        </>
    )
}
