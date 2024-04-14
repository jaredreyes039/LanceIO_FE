import '../../../styles/components/cardItems.css'

export default function CardItemGrad(props){

    return (
        <>
            <div style={{width: props.width, height: props.height}} className="card-item-grad">
                <div className="card-item-grad-header mb-4">
                    <img src={props.icon} alt={props.title} />
                    <h3>{props.title}</h3>
                </div>
                <div className="card-item-grad-body">
                    {props.children}
                </div>
            </div>
        </>
    )
}