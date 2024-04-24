import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Chart, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState, useContext, useRef } from "react";
import { serviceDataContext } from "../../../providers/servicesData.provider";
import { isNull } from "lodash";
import currencyStringToSymbol from "../../../utils/currencySymbolConversion.util";
import { collapseCoords } from "../../../utils/collapseCoords.util";
import { quicksort } from "../../../utils/quicksort.util";
import { useInterval } from "../../../hooks/interval.hook";

let collI = 0
let collJ = 0
let collBounds = 0

// Build dataset structure to feed line plot demon
// @params dataset
function constructPlotDataSeries(dataset, curr) {
	let series = [];
	let xData = [];
	let yData = [];
	if (dataset.length > 0) {
		dataset.forEach((set) => {
			if (set.payment.currency.toLowerCase() === curr.toLowerCase()) {
				set.paymentRecord.forEach((rec) => {
					series.push(rec)
				})
			}
		})
	}
	if (series.length > 0) {
		series = collapseCoords(series, collI, collJ, collBounds)
		series = quicksort(series)
		xData = series.map((set) => { return set[0] })
		yData = series.map((set) => { return set[1] })
	}
	let dataTemplate = {
		x: xData,
		y: yData
	}
	return dataTemplate;
}


// The fucking line plot demon
// (Seriously, this thing fucking sucks, good luck champ!)
export default function LinePlot() {

	ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler)

	const { orderData } = useContext(serviceDataContext)
	const [currentData, setCurrentData] = useState({ x: [], y: [] });
	const lineRef = useRef()

	const carouselRef = useRef(null);
	const slideIds = [
		"sL-1",
		"sL-2",
		"sL-3",
		"sL-4",
		"sL-5",
		"sL-6"
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
		collI = 0;
		// Returns an object{x:[], y:[]}
		let newData = constructPlotDataSeries(orderData, currencies[slidePntr])
		let currentCopy = { ...currentData }
		let xCopy = [...currentCopy.x]
		let yCopy = [...currentCopy.y]
		xCopy.length = 0
		yCopy.length = 0
		newData.x.forEach((val) => {
			xCopy.push(val)
		})
		newData.y.forEach((val) => {
			yCopy.push(val)
		})
		currentCopy.x = xCopy
		currentCopy.y = yCopy
		setCurrentData(currentCopy)
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
			activeSlide.classList.remove("hidden")
			oldSlide.classList.add("hidden")
		}
	}, [slidePntr])

	if (currentData.x.length >= 3) {
		return (
			<>
				{
					currencies.map((curr, idx) => {
						return (
							<div ref={carouselRef}>
								<div className={`${idx === 0 ? "" : "hidden"} max-h-[420px]`} id={'sL-' + (idx + 1)}>
									<Line
										width={((0.66 * 1440)).toString() + 'px'}
										height={'420px'}
										key={Math.random()}
										ref={lineRef}
										datasetIdKey={1}
										options={{
											events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
											plugins: {
												legend: {
													labels: {
														usePointStyle: true
													}
												}
											}
										}}
										data={{
											labels: currentData.x.map((x) => { return new Date(x).toLocaleDateString() }),
											datasets: [
												{
													id: 1,
													label: ` Actual Income ${currencyStringToSymbol(currencies[idx])}${currencies[idx]}`,
													data: currentData.y,
													backgroundColor: '#46cd6e75',
													borderColor: '#efefef',
													pointBorderColor: '#efefef',
													fill: 'origin',
													pointStyle: 'rectRot',
													borderWidth: 3,
													hoverBorderWidth: 7,
													tension: 0.5 // Try to keep between 0.3 and 0.5 for future ref
												}
											]
										}
										}
									/>
								</div>
							</div>
						)
					}
					)
				}
			</>
		)
	}

	if (currentData.x.length < 3) {
		return (
			<div className="card-item-placeholder-header"
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
				<h1 className="mb-2 underline" style={{
				}}>
					Track your income flow and more...
				</h1>
				<p className="modal-text desc mb-2" style={{
					maxWidth: '640px'
				}}>
					Welcome to LanceIO- your dashboard for mitigating
					the overwhelm of clients and orders in the digital age of freelancing.
					Getting started is incredibly simple, selected <strong>'Orders & Services'</strong> click the button in the lower right
					corner of the <strong>Service Manager</strong> to add your offered services. Once you have a service, add your clients
					and see how LanceIO can be your new dashboard for all things freelance!
				</p>
				<p className="modal-text desc" style={{
					maxWidth: '640px'
				}}>
					Once you've recorded 3 payments, you'll be able to see a chart of your income flow to make better budgetting and managment decisions for the future!
				</p>
			</div>

		)

	}
}

