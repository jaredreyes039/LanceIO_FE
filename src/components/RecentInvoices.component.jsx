import { useContext, useEffect, useState } from 'react';
import { serviceDataContext } from '../providers/servicesData.provider';
import styles from '../styles/components/cardItems.css';

export default function RecentInvoices(props) {

	const [invoices, setInvoices] = useState([]);
	const { invoiceData } = useContext(serviceDataContext);

	useEffect(() => {
		setInvoices(invoiceData);
	}, [invoiceData])

	return (
		<>
			<div>
				<h1>
					Recent Invoices Component
				</h1>
			</div>
		</>
	)
}

