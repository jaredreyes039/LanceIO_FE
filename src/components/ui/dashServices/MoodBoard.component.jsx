import { useEffect, useState } from "react"
import PreviewImageBox from "../cards/PreviewImageBox.component"


export default function MoodBoard(props) {

    const [imgUrls, setImgUrls] = useState(props.imgUrls)

    useEffect(() => {
        setImgUrls(props.imgUrls)
    }, [props.imgUrls])

    return (
        <>
            <label htmlFor='moodBoard'>Mood Board</label>
            <div className="modal-text mb-4 flex-col">
                <PreviewImageBox display={props.preview} width='100%' height='128px' maxWidth='360px' maxHeight='128px' src={props.imgFile ? URL.createObjectURL(props.imgFile) : ""} alt="moodboard" />
                {props.preview &&
                    <div className="mood-board mt-4">
                        {imgUrls.length !== 0 ? imgUrls.map((url, index) => {
                            return (
                                <img
                                    className="mood-image"
                                    onClick={() => {
                                        window.open(process.env.REACT_APP_API_URL_IMAGES + `/moodboards/${url}`, '_blank')
                                    }}
                                    key={index} src={process.env.REACT_APP_API_URL_IMAGES + `/moodboards/${url}`} alt="moodboard" style={{
                                        width: '128px',
                                        height: '128px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }} />
                            )
                        }) : ""}
                    </div>
                }
                {!props.preview &&
                    <div className="mood-board">
                        {imgUrls.length !== 0 ? imgUrls.map((url, index) => {
                            return (
                                <img
                                    className="mood-image"
                                    onClick={() => {
                                        window.open(process.env.REACT_APP_API_URL_IMAGES + `/moodboards/${url}`, '_blank')
                                    }}
                                    key={index} src={process.env.REACT_APP_API_URL_IMAGES + `/moodboards/${url}`} alt="moodboard" style={{
                                        width: '128px',
                                        height: '128px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }} />
                            )
                        }) : ""}
                    </div>
                }
            </div>
        </>
    )
}
