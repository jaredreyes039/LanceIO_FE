import { useContext, useEffect, useRef, useState } from "react";
import { serviceDataContext } from "../../providers/servicesData.provider";
import PreviewImageBox from "../ui/cards/PreviewImageBox.component";
import MoodBoard from "../ui/dashServices/MoodBoard.component";

export default function PendingPlanForm(props) {

    const { toast } = props;
    const { orderData, refreshOrderData } = useContext(serviceDataContext)
    const [selectedOrder, setSelectedOrder] = useState(orderData.filter((order) => { return order._id === props.orderId })[0])

    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState(selectedOrder.plannedTasks || []);

    const [imgFile, setImgFile] = useState(null);
    const [imgUrls, setImgUrls] = useState(selectedOrder.mood_image_urls || []);

    const taskInput = useRef(null);

    const handleChangeTask = (e) => {
        setTask(e.target.value);
    }
    const addTask = async (e) => {
        e.preventDefault();
        const response = await fetch(process.env.REACT_APP_API_URL_ORDERS + '/addPlanningTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: props.orderId,
                task: task,
                token: props.token
            }),
        })
        const data = await response.json();
        toast.success("Task added to order: " + task)
        refreshOrderData(props.userId, props.token);
        setTasks([...tasks, data.plannedTasks[data.plannedTasks.length - 1]])
        taskInput.current.value = "";
    }

    const handleFileUpload = async (e) => {
        setImgFile(e.target.files[0]);
    }
    const addMoodImage = async (e) => {
        e.preventDefault();
        refreshOrderData(props.userId, props.token);
        const formData = new FormData();
        formData.append('order_id', props.orderId);
        let file = new File([imgFile], `${props.userId}_${props.orderId}_${new Date().getTime().toString()}.${imgFile.type.split("/")[1]}`, { type: imgFile.type })
        formData.append('file', file);
        const imageUpload = await fetch(process.env.REACT_APP_API_URL_ORDERS + "/addMoodImage", {
            method: "POST",
            body: formData,
        })
        if (imageUpload.status === 200) {
            toast.success("Image added to mood board!")
            setImgUrls([...imgUrls, file.name])
            setImgFile(null);
        }
        else {
            toast("Failed to upload image, please try again later.")
        }
    }

    useEffect(() => {
        setTasks(selectedOrder.plannedTasks);
        setImgUrls(selectedOrder.mood_image_urls);
    }, [selectedOrder])

    return (
        <form style={{ display: props.display }} className="gig-modal-form flex-col">
            <label htmlFor='tasks'>Planned Tasks</label>
            <div className="mb-4">
                {props.orderData.plannedTasks && tasks.map((task, index) => {
                    return (
                        <ul style={{
                            listStyle: 'disc',
                            marginLeft: '24px'
                        }} key={index} className="modal-text task-item">
                            <li>{task.task}</li>
                        </ul>
                    )
                }
                )

                }
                {tasks.length === 0 ? <p className="modal-text">No planned tasks, add a task to
                    start tracking and planning your orders!
                </p> : ""}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '48px'
            }}>
                <input
                    onChange={(e) => { handleChangeTask(e) }}
                    ref={taskInput}
                    name="tasks"
                    style={{
                        marginBottom: '0px',
                        width: '66%',
                    }} className="input" placeholder="Add Task" type="text" />
                <button className="card-btn" style={{
                    position: 'relative',
                    borderRadius: '8px',
                    right: 'unset',
                    bottom: 'unset',
                }}
                    onClick={((e) => {
                        addTask(e);
                    })}
                >
                    <span>+</span>
                </button>
            </div>
            <MoodBoard preview={true} orderData={selectedOrder} imgFile={imgFile} imgUrls={imgUrls} />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                <label className="file-input" style={{
                    width: '66%',
                    marginBottom: '0px',
                }} for="logo">
                    <img src='/clip.png' alt="clip-icon" />
                    <span>Upload Your Inspiration</span>
                </label>
                <input onChange={(e) => { handleFileUpload(e) }} className="file-input hidden" type="file" id="logo" />
                <button className="card-btn" style={{
                    position: 'relative',
                    borderRadius: '8px',
                    right: 'unset',
                    bottom: 'unset',
                }}
                    onClick={((e) => {
                        addMoodImage(e);
                    })}
                >
                    <span>+</span>
                </button>
            </div>
        </form>
    )
}
