import { useContext, useEffect, useState } from 'react';
import { serviceDataContext } from '../../../providers/servicesData.provider';

export default function RecentInvoices(props) {

	const { clientData, orderData, serviceData } = useContext(serviceDataContext);
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
		let invoiceObjsArr = [];
		if (filteredOrderData.length > 0 && clientData.length > 0 && serviceData.length > 0) {
			filteredOrderData.map((order) => {
				let service = serviceData.filter((service) => {
					return service._id === order.service_id;
				});
				let client = clientData.filter((client) => {
					return client._id === order.client_id
				})
				invoiceObjsArr.push({ client: client[0].name, title: service[0].title, delDate: new Date(order.deliveryDate).toLocaleString(), url: 'invoices' + order._id + '.pdf', order_num: order.order_num })
				setInvoiceObjs(invoiceObjsArr)
			})
		}
		else {
			setInvoiceObjs([])
		}
	}, [serviceData, clientData, filteredOrderData])

	if (invoiceObjs.length > 0 && orderData.length > 0) {
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
								<a href={'http://localhost:5001/' + invoice.url} download>

									<div className="order-list-item-body flex justify-around w
							-full">

										<div>
											<span>Service: </span>
											<p>{invoice.title}</p>
										</div>
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
	else {
		return (
			<>
				<div className="card-item-placeholder-header">
					<h1 className="mb-2 underline">
						Finish orders to quickly generate invoices...
					</h1>
					<p className="modal-text mb-2 desc">
						With LanceIO, generating invoices is as easy as fulfilling
						your orders, and using our handy 'generate' tool!
					</p>
				</div>
			</>
		)
	}
}

