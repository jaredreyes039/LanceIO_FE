import { isNull } from "lodash";
import { useContext, useEffect, useRef, useState } from "react"
import CountUp from "react-countup";
import { useInterval } from "../../../hooks/interval.hook";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";

function constructIncomeData(orderData, currency) {
	const allPaymentsArr = [];
	const allOwedArr = [];
	const allPaymentDates = [];
	orderData.forEach((order) => {
		if (order.payment.currency === currency) {
			allPaymentsArr.push(order.payment.amountPaid)
			allOwedArr.push(order.payment.amountOwed)
		}
		order.paymentRecord.map((rec) => {
			if (order.payment.currency === currency) {
				allPaymentDates.push({ num: order.order_num, date: rec[0] })
			}
		})
	})
	let paymentSum;
	let owedSum;
	if (allPaymentDates.length > 0) {
		allPaymentDates.sort((a, b) => { return a.date < b.date })
	}
	if (allPaymentsArr.length > 0) {
		paymentSum = allPaymentsArr.reduce((a, b) => {
			let sum = a + b;
			return sum;
		})
	}
	if (allOwedArr.length > 0) {
		owedSum = allOwedArr.reduce((a, b) => {
			let sum = a + b;
			return sum;
		})
	}
	let incomeData = { paymentSum: paymentSum, owedSum: owedSum, lastPayment: "", orderNum: null }
	if (allPaymentDates.length > 0) {
		incomeData.lastPayment = new Date(allPaymentDates[0].date).toLocaleDateString()
		incomeData.orderNum = allPaymentDates[0].num
	}
	return incomeData;
}

export default function IncomeFlowCard(props) {

	const { orderData } = useContext(serviceDataContext);
	const [totalActualIncome, setTotalActualIncome] = useState(0)
	const [totalExpectedIncome, setTotalExpectedIncome] = useState(0)
	const [lastPayment, setLastPayment] = useState("")
	const [lastOrderNum, setLastOrderNum] = useState(null)

	const carouselRef = useRef(null);
	const slideIds = [
		"s-1",
		"s-2",
		"s-3",
		"s-4",
		"s-5",
		"s-6"
	]
	const currencies = [
		"USD",
		"CAD",
		"EUR",
		"GBP",
		"AUD",
		"JPY"
	]

	const [slidePntr, setSlidePntr] = useState(0);

	useInterval(() => {
		if (slidePntr >= slideIds.length - 1) {
			setSlidePntr((prev) => 0)
		}
		else {
			setSlidePntr((prev) => prev + 1);
		}
	}, 7500)

	useEffect(() => {
		let incomeData = constructIncomeData(orderData, currencies[slidePntr])
		setTotalActualIncome(incomeData.paymentSum)
		setTotalExpectedIncome(incomeData.owedSum)
		setLastPayment(incomeData.lastPayment)
		setLastOrderNum(incomeData.orderNum)
	}, [orderData, slidePntr])

	useEffect(() => {
		const activeSlide = document.getElementById(slideIds[slidePntr])
		let oldSlide;
		if (slidePntr !== 0) {
			oldSlide = document.getElementById(slideIds[slidePntr - 1])
		}
		else {
			oldSlide = document.getElementById(slideIds[slideIds.length - 1])
		}
		if (!isNull(activeSlide) && !isNull(oldSlide)) {
			activeSlide.classList.add("active-slide")
			oldSlide.classList.remove("active-slide")
		}
	}, [slidePntr])

	return (
		<div ref={carouselRef} className="carousel">
			{currencies.map((curr, idx) => {
				return (
					<div key={"s-" + idx} id={"s-" + (idx + 1)} className="slide slide-active">
						<div className="flex flex-col">
							<div className="flex flex-row">
								<h1 className="text-[48px] text-white">{currencyStringToSymbol(curr)}</h1>
								<h1 className="text-[48px] text-white" ><span>{Number(totalActualIncome) ? <CountUp decimals={2} end={totalActualIncome}></CountUp> : (0).toFixed(2)}</span></h1>
							</div>
							<hr></hr>
							<h2>
								<span>Actual Income:</span> {currencyStringToSymbol(curr)}{Number(totalActualIncome) ? <CountUp style={{ color: '#efefef' }} decimals={2} end={totalActualIncome}></CountUp> : (0).toFixed(2)}
							</h2>
							<h2>
								<span>Expected Income:</span> {currencyStringToSymbol(curr)}{Number(totalExpectedIncome) ? <CountUp style={{ color: '#efefef' }} decimals={2} end={totalExpectedIncome}></CountUp> : (0).toFixed(2)}
							</h2>
							<h2>
								<span>Last Payment:</span> {lastPayment === "" ? "N/A" : lastPayment}
							</h2>
							<h2>
								<span>Order: </span>{lastOrderNum === null ? "N/A" : '#' + lastOrderNum}
							</h2>


						</div>
					</div>
				)
			})}
		</div>
	)
}
