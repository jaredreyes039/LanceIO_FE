import { useContext, useEffect, useState } from 'react';
import { serviceDataContext } from '../../../providers/servicesData.provider';
import LoadingIcon from '../cards/LoadingIcon.component';

export default function RecentInvoices(props) {

	const { clientData, orderData, serviceData } = useContext(serviceDataContext);

	const [isLoading, setIsLoading] = useState(true);
	const [showErrMsg, setShowErrMsg] = useState(false);
	const [invoiceObjs, setInvoiceObjs] = useState([]);
	const [filteredOrderData, setFilteredOrderData] = useState([]);

	useEffect(() => {
		let filteredOrderDataCopy = [...filteredOrderData];
		if (orderData.length > 0) {
			let filteredData = orderData.filter((order) => order.order_status.completed === 1);
			if (filteredData.length > filteredOrderDataCopy) {
				filteredData.forEach((datum) => {
					if (!filteredOrderDataCopy.filter(orderCopy => orderCopy._id === datum._id).length > 0) {
						if (datum.order_status.completed === 1) { filteredOrderDataCopy.push(datum) }
						return;
					}
					else {
						return;
					}
				})
			}
			else if (filteredData.length === 0) {
				filteredOrderDataCopy.length = 0
			}
			else {
				let keepOrders = [];
				filteredData.forEach((datum) => {
					if (filteredOrderDataCopy.filter(orderCopy => orderCopy._id === datum._id).length > 0) {
						keepOrders.push(datum)
					}
				})
				filteredOrderDataCopy.splice(0, filteredOrderDataCopy.length)
				keepOrders.forEach((order) => {
					filteredOrderDataCopy.push(order)
				})
			}
		}
		setFilteredOrderData(filteredOrderDataCopy)
	}
		, [orderData])

	useEffect(() => {
		try {
			let invoiceObjsArr = [];
			if (filteredOrderData.length > 0 && clientData.length > 0 && serviceData.length > 0) {
				filteredOrderData.map((order) => {
					try {
						let service = serviceData.filter((service) => {
							return service._id === order.service_id;
						});
						let client = clientData.filter((client) => {
							return client._id === order.client_id
						})
						invoiceObjsArr.push({ client: client[0].name, title: service[0].title, delDate: new Date(order.deliveryDate).toLocaleString(), url: 'invoices' + order._id + '.pdf', order_num: order.order_num })
						setIsLoading(false)
						setInvoiceObjs(invoiceObjsArr)
					}
					catch (err) {
						setIsLoading(false)
						setShowErrMsg(true)
						setInvoiceObjs([])
					}
				})
			}
			else {
				setIsLoading(false)
				setInvoiceObjs([])
			}
		}
		catch (err) {
			setIsLoading(false)
			setShowErrMsg(true)
		}
	}, [serviceData, clientData, filteredOrderData])

	if (invoiceObjs.length > 0 && !isLoading) {
		return (
			<div style={{ height: '240px' }}>
				<ul className='container-scroll'>
					{invoiceObjs.map((invoice) => {

						return (
							<li className="order-list-item w-full"
							>

								<div className="order-list-item-header">
									<h1>{invoice.title}</h1>
									<p className="modal-text">Order #{invoice.order_num}</p>
								</div>
								<a href={process.env.REACT_APP_API_URL_INVOICES + '/' + invoice.url} download>

									<div className="order-list-item-body flex justify-around w
							-full">

										<div>
											<span>Client: </span>
											<p>{invoice.client}</p>
										</div>
										<div>
											<span>Delivery Date: </span>
											<p>{new Date(invoice.delDate).toLocaleDateString()}</p>
										</div>
									</div>
								</a>
							</li>
						)

					})}
				</ul>
			</div>
		)
	}
	else if (invoiceObjs.length === 0 && !isLoading) {
		return (
			<>
				<div className="card-item-placeholder-header">
					<h1 className="mb-2 underline">
						Finish orders to quickly generate invoices...
					</h1>
					<p className="modal-text mb-2 desc">
						With LanceIO, generating invoices is as easy as fulfilling
						your orders, and using our handy ''Generate Invoice' button!
					</p>
				</div>
			</>
		)
	}
	else if (!showErrMsg && isLoading) {
		return (
			<div className="w-full flex items-center justify-center">
				<LoadingIcon />
			</div>
		)
	}
	else {
		return (
			<div className="w-full flex items-center justify-center">
				<p className="modal-text desc">
					Failed to retrieve invoices, please try again later. If this problem persists, contact LanceIO support through Github.
				</p>
			</div>
		)
	}
}

