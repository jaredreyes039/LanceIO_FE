import { useContext, useEffect, useRef, useState } from "react";
import ServiceBasicForm from "../forms/serviceBasic.forms";
import ServiceProForm from "../forms/servicePro.forms";
import { serviceDataContext } from "../../providers/servicesData.provider";
import { formSliderContext } from "../../providers/formSlider.provider";
import { modalContext } from "../../providers/modal.provider";

export default function AddServiceModal(props) {
    const { toast } = props;
    const planningInstructions = [
        `
            Getting started with gig planning and tracking is simplified by Lance.IO, and our friendly
            user interface. To get started, fill out the form to the right and click the "Add Gig" button.
        `,

    ]
    const [proGigSellTypeSlider, setProGigSellTypeSlider] = useState(0);

    const { currentModal, setCurrentModal } = useContext(modalContext);
    const { currentPosition, setCurrentPosition } = useContext(formSliderContext);

    // VIEW REFS
    const gigPlanningModal = useRef();
    const sliderBtn = useRef();

    // VIEW EFFECTS: Modal backdrop and Add Service Modal Slider
    useEffect(() => {
        if (currentModal === "servicePlanningModal") {
            gigPlanningModal.current.classList.remove("hidden");
        } else {
            gigPlanningModal.current.classList.add("hidden");
        }
    }, [currentModal])

    //useEffect(() => {
    //    if (currentPosition === 0) {
    //        sliderBtn.current.style.left = "0%";
    //    }
    //    else {
    //        sliderBtn.current.style.left = "50%";
    //    }
    //}, [currentPosition])

    return (
        <div ref={gigPlanningModal} className="hidden gig-modal xs:w-full xs:max-lg:flex-col bg-gray-900 flex flex-row">
            <div className="close-modal-btn">
                <button onClick={() => {
                    setCurrentModal("");
                    setCurrentPosition(0)
                    setProGigSellTypeSlider(0)
                }}
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
                    }}
                >
                    X
                </button>
            </div>
            <div className="xs:max-lg:w-full p-0 gig-modal-header flex flex-col w-1/2 border-r-2 border-white xs:max-lg:border-0">
                <h1>Gig Planner</h1>
                <p className="modal-text xs:max-md:mb-4">{planningInstructions}</p>
            </div>
            <div className="gig-modal-body pl-12 w-1/2 xs:max-lg:w-full flex flex-col xs:max-lg:pl-0">
                {/*<div className="slider-btn-container">
                    <div className="slider-btn-background">
                        <div ref={sliderBtn} className="slider-btn"></div>
                        <div onClick={() => { setCurrentPosition(0) }} className="basis-1/2 text-center relative z-10">
                            <p>Basic</p>
                        </div>
                        <div onClick={() => { toast.error("Feature coming in a future update, check-in periodically for more exciting features as LanceIO continues to grow with the freelancers we care about!") }} className="basis-1/2 text-center relative z-10 bg-gray-500" style={{ borderRadius: '0px 8px 8px 0px' }}>
                            <p>Pro</p>
                        </div>
                    </div>
                </div>*/}
                <ServiceBasicForm toast={toast} />
                <ServiceProForm />
            </div>
        </div>
    )
}
