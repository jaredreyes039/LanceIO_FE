import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MoodBoard from "../ui/dashServices/MoodBoard.component";
import { serviceDataContext } from './../../providers/servicesData.provider';
import { Table } from "flowbite-react";
import '../../styles/components/tables.css'
import Cookies from 'universal-cookie';
import { modalContext } from "../../providers/modal.provider";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";

function TimeTableEdit(props) {

    const { toast } = props;

    // Necessary for refresh call
    let cookies = new Cookies(null, { path: '/' })
    const userId = cookies.get('user_id')

    // Grab context data
    const { refreshOrderData } = useContext(serviceDataContext)
    const { modalData, setModalData } = useContext(modalContext)

    // Selects the current task from the props array
    let { task } = props
    task = task[0]

    const recTime = useRef()
    let formattedStoredTime
    if (task.time) {
        let newTimeString = new Date(0)
        newTimeString.setSeconds(task.time / 1000)
        formattedStoredTime = newTimeString.toISOString().substring(11, 19)
    }
    const [taskName, setTaskName] = useState(task.task)
    const [isRecording, setIsRecording] = useState(false)
    const [displayTime, setDisplayTime] = useState(formattedStoredTime || "Record to set time")
    const [storeTime, setStoreTime] = useState(task.time || 0)

    const handleChangeTaskName = (e) => {
        setTaskName(e.target.value)
    }

    // Start recording time
    const startRecording = (e) => {
        e.preventDefault()
        setIsRecording(true)
    }

    const handleCloseTimeTable = (e) => {
        e.preventDefault();
        props.editStateFunc(false)
    }

    // Stop recording time
    const stopRecording = async (e) => {
        if (storeTime !== 0) {
            e.preventDefault()
            setIsRecording(false)
            const response = await fetch(process.env.REACT_APP_API_URL_ORDERS + '/enterTaskTime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: task.order_id,
                    task_id: task.task_id,
                    time: storeTime,
                    taskName: taskName,
                    token: props.token
                }),
            })
            const data = await response.json();
            if (data) {
                toast.success("Time updated for task: " + taskName)
            }
        }
        refreshOrderData(userId, props.token)
    }


    // Incredibly messy and can be abstracted in the future 
    useEffect(() => {
        if (isRecording) {
            toast("Recording time for current task, please keep this tab open in the background as you work to keep recording accurately.")
            let startDate = Date.now()
            recTime.current = setInterval(() => {
                let currentDate = Date.now()
                const timeDiff = currentDate - startDate
                let finalTime = new Date(0)
                finalTime.setSeconds((timeDiff + storeTime) / 1000)
                let timeString = finalTime.toISOString().substring(11, 19)
                setDisplayTime(timeString)
                let newStoreTime = timeDiff + storeTime
                setStoreTime(newStoreTime)
            }, 1000)
        }
        else {
            clearInterval(recTime.current)
        }
    }, [isRecording])

    return (
        <>
            <div className="backdrop" style={{
                position: 'fixed',
                top: '0',
                left: '0',
                borderRadius: '8px'

            }}></div>
            <div className="gig-modal flex flex-col xs:max-md:h-dvh xs:max-md:w-full h-fit" >
                <div className="close-modal-btn">
                    <button onClick={(e) => { handleCloseTimeTable(e) }}
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
                <div className="mb-2 flex flex-col gap-4">
                    <label htmlFor="taskName">
                        Update Task Name
                    </label>
                    <input
                        name="taskName"
                        value={taskName}
                        onChange={(e) => { handleChangeTaskName(e) }}
                        required
                        className="input"
                        type="text"
                        style={{
                            width: '100%'
                        }}
                    />
                </div>
                <div className="mb-2 flex flex-col gap-4">
                    <div className="flex flex-col modal-text">
                        <h1><span style={{ color: '#46CD6E' }}>Time spent on task: </span>{displayTime}</h1>
                        <div style={{
                            marginTop: '12px',
                        }} className="edit-btn-container">
                            {!isRecording && <button onClick={(e) => { startRecording(e) }} className="edit-btn record">
                                <div style={{ postion: 'relative', width: '24px', height: '24px' }}>
                                    <img style={{ width: 'inherit', height: 'inherit' }}
                                        src="./playIcon.svg" alt="Play button- click to begin recording time."></img>
                                </div>
                            </button>}
                            {isRecording && <button onClick={(e) => { stopRecording(e) }} className="edit-btn stop">
                                <div style={{ postion: 'relative', width: '24px', height: '24px' }}>
                                    <img style={{ width: 'inherit', height: 'inherit' }}
                                        src="./stopIcon.svg" alt="Stop button- click to stop recording time."></img>
                                </div>
                            </button>
                            }
                            <button className="edit-btn clear">
                                <div style={{ postion: 'relative', width: '24px', height: '24px' }}>
                                    <img style={{ width: 'inherit', height: 'inherit' }}
                                        src="./clearIcon.svg" alt="Clear time button- click to reset task time."></img>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// GETTING THIS TO LIVE RENDER IS A BITCH BE WARNED
// CLEAN THIS MESS IN REFACTORING
export function TimeTable(props) {

    const { toast } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null)
    const { orderData } = useContext(serviceDataContext)

    const [order, setOrder] = useState(orderData.filter((order) => {
        return order._id === props.orderData._id
    })[0])

    const [timeSum, setTimeSum] = useState(order.plannedTasks.reduce((a, b) => {
        let sum
        sum = a + b.time
        return sum
    }, 0))
    const [tasks, setTasks] = useState(order.plannedTasks)
    const [total, setTotal] = useState(timeSum)
    const [totalString, setTotalString] = useState(null)
    const [totalEarned, setTotalEarned] = useState(0)


    // JUST DONT FUCKING TOUCH
    useEffect(() => {
        setOrder(orderData.filter((order) => {
            return order._id === props.orderData._id
        })[0])
    }, [orderData])

    useEffect(() => {
        setTasks(order.plannedTasks)
        if (order.plannedTasks.length > 0) {
            setTimeSum(order.plannedTasks.reduce((a, b) => {
                let sum
                if (b.time === undefined) {
                    return a
                }
                sum = a + b.time
                return sum
            }, 0))
        }
    }, [order])

    useEffect(() => {
        setTotal(timeSum)
        if (!isNaN(timeSum)) {
            let formattedTotal = new Date(0)
            formattedTotal.setSeconds(timeSum / 1000)
            formattedTotal = formattedTotal.toISOString().substring(11, 19)
            setTotalString(formattedTotal)
        }
        else {
            setTotalString("No times recorded.")
        }
    }, [timeSum])

    useEffect(() => {
        let earningsArray = []
        if (order.payment.pay_struct === "hourly") {
            for (let i = 0; i < tasks.length; i++) {
                earningsArray.push(((tasks[i].time / (1000 * 60 * 60)) * order.payment.price))
            }
            let earningsSum = 0;
            if (earningsArray.length > 0) {
                earningsSum = earningsArray.reduce((a, b) => {
                    if (!isNaN(a) && !isNaN(b)) {
                        let sum = a + b
                        return sum
                    }
                    else if (isNaN(b)) {
                        let sum = a;
                        return sum;
                    }
                    else {
                        return a;
                    }
                })
            }
            console.log('Sum:' + earningsSum)
            setTotalEarned(earningsSum.toFixed(2))
        }
    }, [tasks, order])

    const openEditEntry = (e) => {
        e.preventDefault();
        let task = tasks.filter((task) => { return task.task_id === e.target.id })
        setTaskToEdit(task)
        setIsEditing(true)
    }



    return (
        <>
            {isEditing && <TimeTableEdit toast={toast} token={props.token} task={taskToEdit} editStateFunc={setIsEditing} />}
            <label htmlFor="time_tracker" style={{
                display: 'inline-block'
            }} >
                Time Tracker
            </label>
            <div className="overflow-x-scroll" style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <table style={{
                }} class="w-full text-sm text-left rtl:text-right">
                    <thead class="table-head text-xs text-gray-700 uppercase bg-gray-100 "
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <tr>
                            <th scope="col" class="px-6 py-3 rounded-s-lg">
                                Task
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-e-lg">
                                Time
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-e-lg">
                                {props.editingAllowed ? "" : "Earned"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-body-alt">
                        {tasks.map((task, idx) => {
                            let timeString
                            let amountEarned
                            if (task.time) {
                                let finalTime = new Date(0)
                                finalTime.setSeconds(task.time / 1000)
                                timeString = finalTime.toISOString().substring(11, 19)
                            }
                            if (order.payment.pay_struct === "hourly") {
                                if (task.time) {
                                    amountEarned = order.payment.price * (task.time / (1000 * 60 * 60))
                                    amountEarned = amountEarned.toFixed(3)

                                }
                                else {
                                    amountEarned = "N/A"
                                }
                            }
                            else {
                                amountEarned = "FIXED"
                            }
                            return (
                                <tr key={task.task_id + idx} class="task-row bg-white dark:bg-gray-800">
                                    <th
                                        scope="row" class="px-6 py-4 text-gray-400 whitespace-nowrap ">
                                        {task.task}
                                    </th>
                                    <td class="px-6 py-4">
                                        {timeString || "Not recorded"}
                                    </td>
                                    {props.editingAllowed &&
                                        <td
                                            id={task.task_id}
                                            onClick={(e) => { openEditEntry(e) }}
                                            style={{
                                                fontWeight: 'bold',
                                                textDecoration: 'underline'
                                            }} class="px-6 py-4 table-action">
                                            Edit
                                        </td>
                                    }
                                    {!props.editingAllowed &&
                                        <td
                                            id={task.task_id}
                                            style={{
                                                fontWeight: 'bold',
                                            }} class="px-6 py-4 table-action">
                                            {order.payment.pay_struct === 'hourly' && currencyStringToSymbol(order.payment.currency)}{amountEarned}
                                        </td>
                                    }
                                </tr>
                            )
                        })}
                        {/*{props.editingAllowed && <tr class="bg-white dark:bg-gray-800">
                            <th style={{
                                fontWeight: 'bold',
                                textDecoration: 'underline'
                            }} scope="row" class="px-6 py-4  whitespace-nowrap ">
                            </th>
                            <td class="px-6 py-4">
                            </td>
                            <td style={{
                                fontWeight: 'bold',
                                textDecoration: 'underline'
                            }} class="px-6 py-4  whitespace-nowrap table-action">
                                Add Task
                            </td>
                        </tr>}*/}
                    </tbody>
                    <tfoot>
                        <tr style={{
                            backgroundColor: '#1B1B1B',
                            color: '#F4DBDB',
                            textAlign: 'center'
                        }} class="font-semibold">
                            <th scope="row" class="px-6 py-3 text-base">Total</th>
                            <td style={{
                                color: '#46CD6E'
                            }} class="px-6 py-3">{totalString}</td>
                            <td style={{
                                color: '#46CD6E'
                            }} class="px-6 py-3">
                                {currencyStringToSymbol(order.payment.currency)}{order.payment.pay_struct === 'hourly' && !isNaN(totalEarned) ? totalEarned : order.payment.price}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}


export default function ActivePlanForm(props) {

    const { toast } = props;
    const { orderData } = useContext(serviceDataContext)
    const [imgUrls, setImgUrls] = useState(orderData.filter((order) => { return order._id === props.orderId })[0].mood_image_urls);
    const [tasks, setTasks] = useState(props.orderData.plannedTasks || []);
    const [addEntry, setAddEntry] = useState(false);

    useEffect(() => {
        setImgUrls(orderData.filter((order) => { return order._id === props.orderId })[0].mood_image_urls)
    }, [orderData])

    const handleCheckedTask = async (e) => {
        let checkedId = e.currentTarget.id
        let checkedBool = e.currentTarget.checked
        const response = await fetch(process.env.REACT_APP_API_URL_ORDERS + '/updateTaskChecked', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: props.orderData._id,
                task_id: checkedId,
                token: props.token,
                checked: checkedBool
            }),
        })
        const data = await response.json();
        setTasks([...data.plannedTasks]);
    }

    return (
        <>

            <form style={{ display: props.display }} className="gig-modal-form p-0 flex-col md:max-h-[620px] md:h-[540px] md:overflow-y-scroll ">
                <MoodBoard preview={false} imgFile={props.imgFile} imgUrls={imgUrls} orderData={props.orderData} />
                <TimeTable toast={toast} editingAllowed={true} token={props.token} orderData={props.orderData} />
            </form>
        </>
    )
}

