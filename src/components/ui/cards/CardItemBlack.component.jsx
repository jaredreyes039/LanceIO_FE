import '../../../styles/components/cardItems.css'
import PropTypes from 'prop-types'

export default function CardItemBlack(props) {

    return (
        <>
            <div style={{ width: props.width, height: props.height }} className="bg-gray-900 bg-opacity-50 rounded-lg border-white border-2 px-4 py-4 hover:bg-white hover:bg-opacity-15 duration-150 relative">
                <div className="flex items-center mb-2">
                    <img className="mr-2" src={props.icon} alt={props.title} />
                    <h3 className="text-2xl text-white">{props.title}</h3>
                </div>
                {!props.linePlot && <div className="min-h-64 h-full">
                    {props.children}
                </div>}
                {props.linePlot && <div className="h-fit">{props.children}</div>}
            </div>
        </>
    )
}

CardItemBlack.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}
