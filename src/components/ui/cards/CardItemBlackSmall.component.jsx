import CountUp from 'react-countup'
import '../../../styles/components/cardItems.css'
import PropTypes from 'prop-types'

export default function CardItemBlackSmall(props) {

    return (
        <div className="w-full bg-gray-900 bg-opacity-50 rounded-lg m-4 p-2 flex flex-col items-center justify-center border-white border-2 hover:scale-105 duration-150">
            <h1 className="text-white font-bold text-4xl"><CountUp end={props.value}></CountUp></h1>
            <p className="text-white text-md">{props.label}</p>
        </div>
    )
}

CardItemBlackSmall.propTypes = {
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
}
