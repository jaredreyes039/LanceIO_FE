import '../../../styles/components/cardItems.css'

export default function CardItemBlack(props) {

    return (
        <>
            <div style={{ width: props.width, height: props.height }} className="card-item-black">
                <div className="card-item-black-header mb-4">
                    <img src={props.icon} alt={props.title} />
                    <h3>{props.title}</h3>
                </div>
                <div className="card-item-black-body" style={{ height: 'calc(100% - 36px)' }}>
                    {props.children}
                </div>
            </div>
        </>
    )
}
