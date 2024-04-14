import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { modalContext } from "../../providers/modal.provider";
import { formSliderContext } from "../../providers/formSlider.provider";
import { serviceDataContext } from "../../providers/servicesData.provider";
import Cookies from "universal-cookie";


export default function ServiceProForm(props){

    const sliderBtnSellType = useRef();
    const proPlanningForm = useRef();
    const proIndividual = useRef();
    const proPackages = useRef();

    let cookies = new Cookies(null, {path: "/"});
    const user_id = cookies.get("user_id");
    const token = cookies.get("token");

    let {currentModal, setCurrentModal} = useContext(modalContext);
    let {currentPosition, setCurrentPosition} = useContext(formSliderContext);
    let {refreshServiceData} = useContext(serviceDataContext)
    
    // FORM HANDLING
    const [gigName, setGigNameBasic] = useState("");
    const [gigDescription, setGigDescriptionBasic] = useState("");
    const [gigPrice, setGigPriceBasic] = useState("");
    const [gigCurrency, setGigCurrencyBasic] = useState("");
    const [gigPaymentType, setGigPaymentTypeBasic] = useState("");
    const [gigEstDeliveryTime, setGigEstDeliveryTime] = useState("");
    const [proGigSellTypeSlider, setProGigSellTypeSlider] = useState(0);

    // INPUT HANDLING: BOTH FORMS
    const handleGigName = (e) => {
        setGigNameBasic(e.target.value);
    }
    const handleGigDescription = (e) => {
        setGigDescriptionBasic(e.target.value);
    }
    const handleGigPrice = (e) => {
        setGigPriceBasic(e.target.value);
    }
    const handleGigCurrency = (e) => {
        setGigCurrencyBasic(e.target.value);
    }
    const handleGigPaymentType = (e) => {
        setGigPaymentTypeBasic(e.target.value);
    }

    useEffect(()=>{
        if(currentPosition === 1){
            proPlanningForm.current.classList.remove("hidden-alt");
        }
        else{
            proPlanningForm.current.classList.add("hidden-alt");
        }
    }, [currentPosition])
    
    useEffect(()=>{
        if(props.edit){
            setGigNameBasic(props.serviceEdit.title);
            setGigDescriptionBasic(props.serviceEdit.description);
            setGigPriceBasic(props.serviceEdit.price);
            setGigCurrencyBasic(props.serviceEdit.currency);
            setGigPaymentTypeBasic(props.serviceEdit.payStruct);
            setGigEstDeliveryTime(props.serviceEdit.estDeliveryTime);
        }
    }, [props.edit])

    useEffect(()=>{
        if(proGigSellTypeSlider === 0){
            sliderBtnSellType.current.style.left = "0%";
        }
        else{
            sliderBtnSellType.current.style.left = "50%";
        }

    }, [proGigSellTypeSlider])

    useEffect(()=>{
        if(proGigSellTypeSlider === 0){
            proIndividual.current.classList.remove("hidden-alt");
            proPackages.current.classList.add("hidden-alt");
        }
        else{
            proPackages.current.classList.remove("hidden-alt");
            proIndividual.current.classList.add("hidden-alt");
        }
    }, [proGigSellTypeSlider])



    return (
        <form ref={proPlanningForm} className="gig-modal-form flex flex-col">
            <input onChange={(e)=>{handleGigName(e)}} value={gigName} required className="input" type="text" placeholder="Gig Name" />
            <textarea onChange={(e)=>{handleGigDescription(e)}} value={gigDescription} required className="input" type="text" placeholder="Gig Description" />
            
            {/* SLIDER: BASIC v. PRO */}
            <div className="slider-btn-container mb-4">
            <div className="slider-btn-background">
                <div ref={sliderBtnSellType} className="slider-btn"></div>
                    <div onClick={()=>{setProGigSellTypeSlider(0)}} className="basis-1/2 text-center relative z-10">
                        <p>Individual</p>
                    </div>
                    <div onClick={()=>{setProGigSellTypeSlider(1)}} className="basis-1/2 text-center relative z-10">
                        <p>Packages</p>
                    </div>
                </div>
            </div>

            {/* CURRENCY INPUTS */}
            <div ref={proIndividual}>
                <div className="form-group flex flex-row items-center justify-center">
                    <span className="modal-text relative left-4">$</span>
                    <input value={gigPrice} onChange={(e)=>{handleGigPrice(e)}} required style={{marginBottom: 0}} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Gig Price" />
                </div>
                <div className="form-group flex flex-row items-center justify-center gap-4">
                    <select value={gigCurrency} onChange={(e)=>{handleGigCurrency(e)}} required className="select-input">
                        <option default value="">Select Currency</option>
                        <option value="usd">USD</option>
                        <option value="cad">CAD</option>
                        <option value="eur">EUR</option>
                        <option value="gbp">GBP</option>
                        <option value="aud">AUD</option>
                        <option value="jpy">JPY</option>
                    </select>
                    <select value={gigPaymentType} onChange={(e)=>{handleGigPaymentType(e)}} required className="select-input">
                        <option default value="">Payment Structure</option>
                        <option value="hourly">Hourly</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>
            </div>

            <div className="pro-sub-form flex flex-col w-full" ref={proPackages}>
                <div className="flex flex-col w-full">
                    <p className="modal-text mb-4">Package A</p>
                    <input required className="input" type="text" placeholder="Package Name" />
                    <textarea required className="input" type="text" placeholder="Package Description" />
                    <div className="form-group flex flex-row items-center justify-center">
                        <span className="modal-text relative left-4">$</span>
                        <input required style={{marginBottom: 0}} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Package Price" />
                    </div>
                    <div className="form-group flex flex-row items-center justify-center gap-4">
                        <select required className="select-input">
                            <option default value="">Select Currency</option>
                            <option value="usd">USD</option>
                            <option value="cad">CAD</option>
                            <option value="eur">EUR</option>
                            <option value="gbp">GBP</option>
                            <option value="aud">AUD</option>
                            <option value="jpy">JPY</option>
                        </select>
                        <select required className="select-input">
                            <option default value="">Payment Structure</option>
                            <option value="hourly">Hourly</option>
                            <option value="fixed">Fixed</option>
                        </select>

                        
                    </div>
                </div>


                <div className="flex flex-col w-full">
                    <p className="modal-text mb-4">Package B</p>
                    <input required className="input" type="text" placeholder="Package Name" />
                    <textarea required className="input" type="text" placeholder="Package Description" />
                    <div className="form-group flex flex-row items-center justify-center">
                        <span className="modal-text relative left-4">$</span>
                        <input required style={{marginBottom: 0}} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Package Price" />
                    </div>
                    <div className="form-group flex flex-row items-center justify-center gap-4">
                        <select required className="select-input">
                            <option default value="">Select Currency</option>
                            <option value="usd">USD</option>
                            <option value="cad">CAD</option>
                            <option value="eur">EUR</option>
                            <option value="gbp">GBP</option>
                            <option value="aud">AUD</option>
                            <option value="jpy">JPY</option>
                        </select>
                        <select required className="select-input">
                            <option default value="">Payment Structure</option>
                            <option value="hourly">Hourly</option>
                            <option value="fixed">Fixed</option>
                        </select>

                        
                    </div>
                </div>


                <div className="flex flex-col w-full">
                    <p className="modal-text mb-4">Package C</p>
                    <input required className="input" type="text" placeholder="Package Name" />
                    <textarea required className="input" type="text" placeholder="Package Description" />
                    <div className="form-group flex flex-row items-center justify-center">
                        <span className="modal-text relative left-4">$</span>
                        <input required style={{marginBottom: 0}} type="number" className="input w-full" step="0.01" max="1000000" placeholder="Package Price" />
                    </div>
                    <div className="form-group flex flex-row items-center justify-center gap-4">
                        <select required className="select-input">
                            <option default value="">Select Currency</option>
                            <option value="usd">USD</option>
                            <option value="cad">CAD</option>
                            <option value="eur">EUR</option>
                            <option value="gbp">GBP</option>
                            <option value="aud">AUD</option>
                            <option value="jpy">JPY</option>
                        </select>
                        <select required className="select-input">
                            <option default value="">Payment Structure</option>
                            <option value="hourly">Hourly</option>
                            <option value="fixed">Fixed</option>
                        </select>

                        
                    </div>
                </div>
            </div>

        </form>
    )
}