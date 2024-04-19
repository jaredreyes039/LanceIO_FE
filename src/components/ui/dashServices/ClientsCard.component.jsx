import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import ViewContactModal from "../../modals/viewContactModal.component";
import { modalContext } from "../../../providers/modal.provider";
import { serviceDataContext } from "../../../providers/servicesData.provider";


export default function ClientsCard(props) {
    const { toast } = props;

    const cookies = new Cookies(null, { path: "/" });
    const user_id = cookies.get("user_id")

    // MODAL
    const { currentModal, setCurrentModal } = useContext(modalContext);
    const { clientData, refreshClientData } = useContext(serviceDataContext);

    // CLIENT DATA VIEW
    const [clientContactData, setClientContactData] = useState([]);
    const [currentClientView, setCurrentClientView] = useState({
        name: "",
        bio: "",
        email: "",
        phone: "",
        notes: "",
        connection: "",
        orders: [],
    });
    const [formErrorMsg, setFormErrorMsg] = useState("")

    const contactsFormModal = useRef();

    // ADD CONTACT FORM STATES
    const clientName = useRef()
    const clientEmail = useRef()
    const clientBio = useRef()
    const clientNotes = useRef()
    const clientConnection = useRef()

    // Form Handling
    const handleSubmitContactForm = async (e) => {
        e.preventDefault();
        if (clientName.length === 0) {
            setFormErrorMsg("Please add a client name.")
            return;
        }
        else {
            const res = await fetch(process.env.REACT_APP_API_URL_CLIENTS + "/addContact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                    name: clientName.current.value,
                    email: clientEmail.current.value,
                    bio: clientBio.current.value,
                    notes: clientNotes.current.value,
                    connection: clientConnection.current.value,
                }),
            })
            if (res.status === 200) {
                toast.success("Client added to contacts! Add orders to clients to see the full capabilities of LanceIO's project tracking and management.")
                setCurrentModal('')
                clientName.current.value = ""
                clientEmail.current.value = ""
                clientBio.current.value = ""
                clientConnection.current.value = ""
                clientNotes.current.value = ""
                refreshClientData(user_id);
            }
            else {
                setFormErrorMsg("Something went wrong, please try again later.")
            }
        }
    }


    useEffect(() => {
        setClientContactData(clientData);
    }, [clientData])

    const openAddContactsModal = (e) => {
        e.preventDefault();
        setCurrentModal('addContactsModal')
    }
    useEffect(() => {
        if (currentModal === 'addContactsModal') {
            contactsFormModal.current.classList.remove('modal-hidden');
            contactsFormModal.current.classList.add('modal-visible');
        }
        else {
            contactsFormModal.current.classList.add('modal-hidden');
            contactsFormModal.current.classList.remove('modal-visible');
        }
    }, [currentModal])

    const handleCloseModal = (e) => {
        e.preventDefault();
        setCurrentModal("");
    }

    // REMOVED ABILITY TO ADD CLIENT LOGO/IMG FOR NOW, SEEMS LIKE AN UNEEDED FEATURE IMO, WE'LL SEE
    return (
        <>
            <ViewContactModal
                toast={toast}
                isOpen={currentModal === 'viewContactModal' ? true : false}
                clientName={currentClientView.name}
                clientBio={currentClientView.bio}
                clientEmail={currentClientView.email}
                clientNotes={currentClientView.notes}
                clientConnection={currentClientView.connection}
                clientOrders={currentClientView.orders}
                clientId={currentClientView.clientId}
            />
            <div ref={contactsFormModal} className="hidden gig-modal xs:w-full xs:max-lg:flex-col bg-gray-900 flex flex-row">
                <div className="close-modal-btn">
                    <button onClick={(e) => { handleCloseModal(e) }}
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

                <div className="xs:max-lg:w-full p-0 gig-modal-header flex flex-col w-1/2 border-r-2 border-white xs:max-lg:border-0">
                    <h1>Add Contacts to Track & Assign Orders</h1>
                    <p className="modal-text">
                        Before you can begin tracking orders,
                        you need to add clients to attach service orders to.
                    </p>
                    <br></br>
                    <p className="modal-text">
                        Adding a new contact is incredibly easy, just fill out
                        the form to the right and click the "Add Contact" button!
                    </p>
                    <br></br>
                    <p className="modal-text">
                        You can edit contact information at any time in the future
                        by clicking on the contact card you want to edit, so don't worry
                        if you can't fill out the entire form! Lance.IO is built to be adaptive
                        to YOUR needs.
                    </p>
                </div>


                <div className="gig-modal-body pl-12 w-1/2 xs:max-lg:w-full flex flex-col xs:max-lg:pl-0">
                    <form className="modal-form" onSubmit={((e) => { handleSubmitContactForm(e) })}>
                        <p className="modal-text mb-2">Client Contact Details</p>
                        <label>Client Name</label>
                        <input ref={clientName} required className="input" type="text" id="client_name" placeholder="Client Name" />
                        <label>Client Email</label>
                        <input ref={clientEmail} className="input" type="text" id="client_email" placeholder="Client Email (Optional)" />
                        <p className="modal-text mb-2">Optional Client Notes</p>
                        <label>Client Bio</label>
                        <input ref={clientBio} className="input" type="text" id="client_bio" placeholder="Client Bio (Optional)" />
                        <label>How did you and the client connect?</label>
                        <input ref={clientConnection} className="input" type="text" id="client_connection" placeholder="How did you connect? (Optional)" />
                        <label>Additional Notes</label>
                        <textarea ref={clientNotes} className="input" type="text" id="client_notes" placeholder="Notes (Optional)" />
                        <button type="submit" className="btn-submit self-end">+ Add Client</button>
                    </form>
                </div>
            </div>

            {clientData.length > 0 &&
                <ul className="flex flex-col client-card-container">
                    {clientContactData.map((client) => {
                        return (
                            <>
                                <li onClick={() => {
                                    setCurrentClientView(
                                        {
                                            name: client.name,
                                            bio: client.bio,
                                            email: client.email,
                                            notes: client.notes,
                                            connection: client.connection,
                                            orders: client.orders,
                                            clientId: client._id,
                                        }
                                    )
                                    setCurrentModal('viewContactModal')
                                }} className="client-card">
                                    <div>
                                        <h1 className="client-name">{client.name}</h1>
                                        <p className="client-info"><span>Email: </span>{client.email}</p>
                                        <p className="client-info"><span>Total Orders: </span>{client.orders.length}</p>
                                    </div>
                                </li>
                            </>
                        )
                    })}
                </ul>
            }
            {clientData.length === 0 &&
                <div className="card-item-placeholder-header">
                    <h1 className="mb-2 underline">
                        Add clients to start tracking orders...
                    </h1>
                    <p className="modal-text mb-2 desc">
                        Once you've added a client and a service to your
                        account, you can begin using the full capacity of
                        LanceIO's order planning and tracking!
                    </p>
                </div>
            }
            {
                formErrorMsg.length > 0 && <p className="modal-text">**{formErrorMsg}</p>
            }
            <button onClick={(e) => { openAddContactsModal(e) }} className="card-btn">
                <span>+</span>
            </button>
        </>
    )
}
