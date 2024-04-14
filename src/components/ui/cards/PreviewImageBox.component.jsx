

export default function PreviewImageBox(props){

    return (
        <div style={{
            position: 'relative',
            width: props.width,
            height: props.height,
            maxWidth: props.maxWidth,
            maxHeight: props.maxHeight,
            borderRadius: props.customRadius? props.customRadius : '8px',
            overflow: 'hidden',
            backgroundColor: '#030303',
            display: props.display ? 'flex' : 'none',
        }} >
            {props.src ?
            <img
            src={props.src}
            alt={props.alt}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: props.customRadius? props.customRadius : '8px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
            }} /> : <p style={{
                color: 'white',
                textAlign: 'center',
                margin: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                    Preview your image here!
                </p>}
        </div>
    )
}