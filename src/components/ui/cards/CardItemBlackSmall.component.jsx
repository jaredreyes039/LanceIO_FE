import CountUp from 'react-countup'
import '../../../styles/components/cardItems.css'

export default function CardItemBlackSmall(props) {

    return (
        <div className="card-container-small">
            <h1><CountUp end={props.value}></CountUp></h1>
            <p>{props.label}</p>
        </div>
    )
}
