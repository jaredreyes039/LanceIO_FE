import ToolBar from "../layouts/Toolbar.component";
import CardItemBlack from "../components/ui/cards/CardItemBlack.component";
import CardItemGrad from "../components/ui/cards/CardItemGreen.component";
import PageBodyLayout from "../layouts/PageBody.layout";
import '../styles/dashboard.css'
import { useContext, useEffect, useRef } from "react";
import { serviceDataContext } from "../providers/servicesData.provider";
import OrdersCard from "../components/ui/dashServices/PendingOrdersCard.component";
import RecentInvoices from "../components/ui/dashServices/RecentInvoices.component";
import UpcomingDelivery from "../components/ui/dashServices/UpcomingDelivery.component";
import LinePlot from "../components/ui/dashMain/LinePlot.component";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import { modalContext } from "../providers/modal.provider";
import ViewOrderModal from "../components/modals/viewOrderModal.component";
import PaymentModal from "../components/modals/PaymentModal.component";
import CardItemBlackSmall from "../components/ui/cards/CardItemBlackSmall.component";
import IncomeFlowCard from "../components/ui/dashMain/IncomeFlow.component";

export default function Home(props) {
        let cookies = new Cookies(null, { path: "/" });
        let user_id = cookies.get("user_id");
        let token = cookies.get("token");

        const { serviceData, clientData, orderData, getOrderData, getServiceData, getClientData } = useContext(serviceDataContext);
        const { currentModal } = useContext(modalContext)

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
                getClientData(user_id, token)
                getOrderData(user_id, token);
        }, [])

        return (
                <>
                        <ToastContainer />
                        {currentModal === 'viewOrderModal' && <ViewOrderModal toast={toast} token={token} />}
                        {currentModal === 'paymentModal' && <PaymentModal toast={toast} token={token} userId={user_id} />}
                        <div className="backdrop" ref={backdrop}>
                        </div>

                        <div className="dashboard-page">
                                <ToolBar />
                                <PageBodyLayout>
                                        <div className="top-dash-row flex justify-evenly flex-1">
                                                <CardItemBlack
                                                        width="33%"
                                                        height="360px"
                                                        icon="./icons/GigsIcon.svg"
                                                        title="Active Orders"
                                                >
                                                        <OrdersCard orders={orderData} trackingType="active" />
                                                </CardItemBlack>
                                                <CardItemBlack
                                                        width="33%"
                                                        height="360px"
                                                        icon="./icons/IncomeIcon.svg"
                                                        title="Income Summary"
                                                >
                                                        <IncomeFlowCard />
                                                </CardItemBlack>
                                                <CardItemBlack
                                                        width="33%"
                                                        height="360px"
                                                        icon="./icons/DashboardIcon.svg"
                                                        title="Upcoming Deliveries"
                                                >
                                                        <UpcomingDelivery />
                                                </CardItemBlack>
                                        </div>
                                        <div className="mid-dash-row flex justify-evenly flex-1">
                                                <CardItemBlack
                                                        width="66%"
                                                        height='fit-content'
                                                        icon="./icons/IncomeIcon.svg"
                                                        title="Your Outlook"
                                                >
                                                        <LinePlot />
                                                </CardItemBlack>
                                                <div className="flex flex-col flex-1">
                                                        <div className="flex flex-1 justify-evenly">
                                                                <CardItemBlackSmall
                                                                        value={serviceData.length}
                                                                        label="Services"
                                                                />
                                                                <CardItemBlackSmall
                                                                        value={clientData.length}
                                                                        label="Clients"
                                                                />
                                                                <CardItemBlackSmall
                                                                        value={orderData.length}
                                                                        label="Orders"
                                                                />
                                                        </div>
                                                        <div className="flex flex-1 justify-evenly">
                                                                <CardItemBlack
                                                                        width="100%"
                                                                        height="296px"
                                                                        icon="./icons/InvoiceIcon.svg"
                                                                        title="Quick Generate Invoice"
                                                                >
                                                                        <OrdersCard
                                                                                home
                                                                                toast={toast}
                                                                                orders={orderData}
                                                                                trackingType="completed"
                                                                        />
                                                                </CardItemBlack>
                                                        </div>
                                                </div>

                                        </div>
                                </PageBodyLayout >
                        </div >
                </>
        )
}
