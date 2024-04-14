import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Chart, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState, useContext, useRef } from "react";
import { serviceDataContext } from "../../../providers/servicesData.provider";

let collI = 0
let collJ = 0
let collBounds = 0

// Pretty solid quicksort
function quicksort(arr) {
	if (arr.length <= 1) {
		return arr;
	}
	let pivot = arr[0]
	let leftArr = []
	let rightArr = []

	for (let i = 1; i < arr.length; i++) {
		if (arr[i][0] < pivot[0]) {
			leftArr.push(arr[i])
		} else {
			rightArr.push(arr[i])
		}
	}
	return [...quicksort(leftArr), pivot, ...quicksort(rightArr)]
}

// I want to improve the performance on this 
// (Current: O(n) where n{0, 365*2} or two years of data points max)
// @params coords [[x,y]...[x_n,y_n]]
function collapseCoords(coords) {
	collBounds = coords.length
	if (collI <= collBounds - 2) {
		let similarCoords = coords.filter((set) => {
			return set[0] === coords[collI][0]
		})
		for (let k = 1; k < similarCoords.length; k++) {
			coords[collI][collJ + 1] += similarCoords[k][collJ + 1]
			coords.splice(coords.indexOf(similarCoords[k]), 1)
		}
		collI++
		collapseCoords(coords)
	}
	return coords
}

// Build dataset structure to feed line plot demon
// @params dataset
function constructPlotDataSeries(dataset) {
	let series = [];
	let xData = [];
	let yData = [];
	if (dataset.length > 0) {
		dataset.forEach((set) => {
			set.paymentRecord.forEach((rec) => {
				series.push(rec)
			})
		})
	}
	if (series.length > 0) {
		series = collapseCoords(series)
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

	useEffect(() => {
		collI = 0;
		// Returns an object{x:[], y:[]}
		let newData = constructPlotDataSeries(orderData)
		// Need to copy the nested arrays from the object
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
	}, [orderData])

	if (currentData.x.length > 0) {
		return (
			<Line
				width={((0.66 * 1440) - 128).toString() + 'px'}
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
							label: " Actual Income",
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
		)
	}

	if (currentData.x.length <= 0) {
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
				<p className="modal-text desc" style={{
					maxWidth: '640px'
				}}>
					Welcome to LanceIO- your dashboard for mitigating
					the overwhelm of clients and orders in the digital age of freelancing.
					Getting started is incredibly simple, selected <strong>'Orders & Services'</strong> click the button in the lower right
					corner of the <strong>Service Manager</strong> to add your offered services. Once you have a service, add your clients
					and see how LanceIO can be your new dashboard for all things freelance!
				</p>
			</div>

		)

	}
}

