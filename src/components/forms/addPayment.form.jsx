import { Datepicker } from "flowbite-react";
import { useContext, useState } from "react";
import { modalContext } from "../../providers/modal.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import DATE_PICKER_THEME from "../../utils/datePickerTheme";


export default function AddPaymentForm(props) {

    const { toast } = props;

    const { orderId, userId, token } = props;
    const [payAmnt, setPayAmnt] = useState(0)
    const [payDate, setPayDate] = useState(null)
    const { refreshOrderData } = useContext(serviceDataContext)
    const { setCurrentModal } = useContext(modalContext)

    const handleChangePayAmount = (e) => {
        e.preventDefault()
        setPayAmnt(e.currentTarget.value)
    }
    const handleChangePayDate = (date) => {
        date = date.toISOString()
        setPayDate(date)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let res = await fetch(process.env.REACT_APP_API_URL_ORDERS + '/addPayment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                order_id: orderId,
                payment: payAmnt,
                paymentDate: payDate
            })
        })
        if (res.status === 200) {
            refreshOrderData(userId, token)
            setCurrentModal("")
            toast.success("Payment recorded for selected order, and client payment history updated!")
        }
        else {
            toast("Failed to add payment, please try again later.")
        }
    }

    return (
        <>
            <form onSubmit={(e) => { handleSubmit(e) }} style={{ display: props.display }} className="gig-modal-form flex-col">
                <label htmlFor="CostDel">Cost and Est. Delivery Time</label>
                <div name="CostDel" className="form-group flex flex-row items-center justify-center">
                    <span className="modal-text relative left-4">$</span>
                    <input value={payAmnt} onChange={(e) => { handleChangePayAmount(e) }} required style={{ marginBottom: 0 }} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Gig Price" />
                </div>
                <div className="modal-text flex flex-col">
                    <p className="mb-2">When is the order due for delivery?</p>
                    <Datepicker
                        value={new Date(payDate).toLocaleDateString()}
                        onSelectedDateChanged={(date) => { handleChangePayDate(date) }}
                        name='orderDueDate' style={{
                            backgroundColor: '#1E1E1E',
                            border: 'none',
                            borderBottom: '1px solid #46CD6E',
                            borderRadius: '0px',
                            color: '#F4DBDB'
                        }} className="mb-6" theme={DATE_PICKER_THEME} />
                </div>
                <button type="submit" className="btn-submit self-end">Submit Payment</button>

            </form>
        </>
    )
}
