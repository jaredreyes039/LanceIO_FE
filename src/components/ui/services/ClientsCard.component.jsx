import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import ViewContactModal from "../../modals/viewContactModal.component";
import { modalContext } from "../../../providers/modal.provider";
import { serviceDataContext } from "../../../providers/servicesData.provider";

export default function ClientsCard(props) {

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

    const contactsFormModal = useRef();

    // ADD CONTACT FORM STATES

    const clientName = useRef()
    const clientEmail = useRef()
    const clientPhone = useRef()
    const clientBio = useRef()
    const clientNotes = useRef()
    const clientConnection = useRef()

    // Form Handling
    // ADD ERROR PROMPT FOR FORM
    const handleSubmitContactForm = async (e) => {
        e.preventDefault();
        if (clientName === '') {
            alert('Please enter a client name')
            return;
        }
        else {
            const res = await fetch("http://localhost:5001/api/clients/addContact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                    name: clientName.current.value,
                    email: clientEmail.current.value,
                    phone: clientPhone.current.value,
                    bio: clientBio.current.value,
                    notes: clientNotes.current.value,
                    connection: clientConnection.current.value,
                }),
            })
            if (res.status === 200) {
                setCurrentModal('')
                clientName.current.value = ""
                clientEmail.current.value = ""
                clientPhone.current.value = ""
                clientBio.current.value = ""
                clientConnection.current.value = ""
                clientNotes.current.value = ""
                refreshClientData(user_id);
            }
            else {
                // Add toast here
                alert('Something went wrong, please try again later...')
                setCurrentModal('')
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

    return (
        <>
            <ViewContactModal
                isOpen={currentModal === 'viewContactModal' ? true : false}
                clientName={currentClientView.name}
                clientBio={currentClientView.bio}
                clientEmail={currentClientView.email}
                clientPhone={currentClientView.phone}
                clientNotes={currentClientView.notes}
                clientConnection={currentClientView.connection}
                clientOrders={currentClientView.orders}
                clientId={currentClientView.clientId}
            />
            {/* MOVE THIS MODAL HOLY FUCKING SHIT I FORGOT */}
            <div ref={contactsFormModal} className="modal-container modal-hidden">
                <div className="modal-header">
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

                <div className="modal-body">
                    <form className="modal-form" onSubmit={((e) => { handleSubmitContactForm(e) })}>
                        <p className="modal-text mb-2">Client Contact Details</p>
                        <input ref={clientName} className="input" type="text" id="client_name" placeholder="Client Name" />
                        <input ref={clientEmail} className="input" type="text" id="client_email" placeholder="Client Email (Optional)" />
                        <input ref={clientPhone} className="input" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" id="client_phone" placeholder="XXX-XXX-XXXX" />
                        <p className="modal-text mb-2">Optional Client Notes</p>
                        <input ref={clientBio} className="input" type="text" id="client_bio" placeholder="Client Bio (Optional)" />
                        <input ref={clientConnection} className="input" type="text" id="client_connection" placeholder="How did you connect? (Optional)" />
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
                                            phone: client.phone,
                                            notes: client.notes,
                                            connection: client.connection,
                                            orders: client.orders,
                                            clientId: client._id,
                                        }
                                    )
                                    setCurrentModal('viewContactModal')
                                }} className="client-card">
                                    <div>
                                        <p className="client-info"><span>Email: </span>{client.email}</p>
                                        <p className="client-info"><span>Phone: </span>{client.phone}</p>
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
            <button onClick={(e) => { openAddContactsModal(e) }} className="card-btn">
                <span>+</span>
            </button>
        </>
    )
}
