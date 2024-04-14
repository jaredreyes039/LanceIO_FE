import React from "react";


export default class ModalContainer extends React.Component {
    render(){
        return(
            <>
                <div style={{zIndex: 101}} className="modal-container flex">
                    <div className="close-modal-btn">
                            <button onClick={()=>{this.props.closeHandler()}}
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
                    {this.props.children}
                </div>
            </>
        )
    }
}