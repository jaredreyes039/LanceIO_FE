import { useContext, useEffect, useRef, useState } from "react";
import EditServiceModal from "../../modals/editService.modal";
import { modalContext } from "../../../providers/modal.provider";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import AddServiceModal from "../../modals/addService.modal";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";

export default function ServiceManager(props) {

    const { toast } = props

    const [editSelection, setEditSelection] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const { currentModal, setCurrentModal } = useContext(modalContext);
    const { serviceData } = useContext(serviceDataContext);

    const handleEditService = (e) => {
        let serviceId = e.target.parentNode.id
        if (serviceId === "") {
            return;
        }
        else {
            setCurrentModal("editServiceModal")
            let service = serviceData.filter((gig) => {
                return gig._id === serviceId
            })[0]
            setEditSelection(service)
        }
    }

    useEffect(() => {
        if (serviceData.length) {
            setIsLoading(false)
        }
    }, [serviceData])

    return (
        <>
            {!isLoading &&
                <>
                    <div style={{ width: '100%', height: 'inherit', position: 'relative' }}>
                        <AddServiceModal toast={toast} />
                        <EditServiceModal
                            isOpen={currentModal === 'editServiceModal' ? true : false}
                            serviceData={editSelection}
                        />
                        <div style={{
                            height: '240px',
                            overflowX: 'hidden',
                            overflowY: 'scroll'
                        }}>
                            <table className="table w-full">
                                <thead className="table-head text-center py-8 text-lg">
                                    <tr>
                                        <th scope="col" style={{ width: '25%' }}>Gig Title</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Est. Delivery Time</th>
                                        <th className="xs:max-md:hidden" scope="col">Pending Orders</th>
                                        <th className="xs:max-md:hidden" scope="col">Active Orders</th>
                                        <th className="xs:max-md:hidden" scope="col">Fulfilled Orders</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {serviceData.map((gig) => {
                                        return (
                                            <tr id={gig._id} onClick={(e) => {
                                                handleEditService(e)
                                            }}>
                                                <td>{gig.title}</td>
                                                <td>{currencyStringToSymbol(gig.currency)}{gig.price.toFixed(2)}{gig.payStruct === 'fixed' ? " Fixed" : "/hr"}</td>
                                                <td>{gig.estDeliveryTime || ""}</td>
                                                <td className="xs:max-md:hidden"  >{gig.orders.pending}</td>
                                                <td className="xs:max-md:hidden"   >{gig.orders.active}</td>
                                                <td className="xs:max-md:hidden"  >{gig.orders.completed}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button onClick={() => { setCurrentModal('servicePlanningModal') }} className="card-btn">
                        <span>+</span>
                    </button>
                </>
            }
            {isLoading &&
                <div style={{ width: '100%', height: 'inherit', position: 'relative' }}>
                    <AddServiceModal toast={toast} />
                    <div className="card-item-placeholder-header"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                        <h1 className="mb-2 underline text-white">
                            Add, view, and manage your offered services here...
                        </h1>
                        <p className="xs:max-md:hidden modal-text mb-2 desc text-white w-1/3">
                            Welcome to LanceIO- your dashboard for mitigating
                            the overwhelm of clients and orders in the digital age of freelancing.
                            Getting started is incredibly simple, click the button in the lower right
                            corner to add your offered services. Once you have a service, add your clients
                            and see how LanceIO can be your new dashboard for all things freelance!
                        </p>
                        <p className="md:hidden modal-text mb-2 desc text-white w-1/3">
                            Add a service to get started!
                        </p>

                    </div>
                    <button onClick={() => { setCurrentModal('servicePlanningModal') }} className="card-btn">
                        <span>+</span>
                    </button>
                </div>
            }
        </>
    )
}
