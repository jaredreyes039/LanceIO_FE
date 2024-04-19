import '../../../styles/components/cardItems.css'

export default function CardItemGrad(props) {

    return (
        <>
            <div style={{ width: props.width, height: props.height }} className="w-full py-4 px-4 bg-green-300 bg-opacity-50 rounded-lg border-2 border-white">
                <div className="flex items-center w-full gap-4 mb-4">
                    <img src={props.icon} alt={props.title} />
                    <h3 className="text-white text-2xl">{props.title}</h3>
                </div>
                <div className="card-item-grad-body">
                    {props.children}
                </div>
            </div>
        </>
    )
}
