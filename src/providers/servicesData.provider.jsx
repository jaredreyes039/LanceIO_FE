import { createContext, useContext, useState } from "react";
import { get } from './../lib/axios.util';
import { isEqual } from "lodash";

export const serviceDataContext = createContext()


export default function ServiceDataProvider(props) {

    const [serviceData, setServiceData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [clientData, setClientData] = useState([]);


    const API_URL_SERVICES = process.env.REACT_APP_API_URL_SERVICES
    const API_URL_ORDERS = process.env.REACT_APP_API_URL_ORDERS + '/getOrders'
    const API_URL_CLIENTS = process.env.REACT_APP_API_URL_CLIENTS + '/getContact'

    const getServiceData = async (user_id, token) => {
        console.log("Fetching service data...")
        const response = await get(API_URL_SERVICES + `/${user_id}/${token}`);
        if (serviceData.length > 0) {
            const refreshedData = response;
            let sameData = isEqual(refreshedData, serviceData)
            if (sameData) {
                return;
            }
            else {
                if (refreshedData.length > serviceData.length) {
                    setServiceData([...serviceData, refreshedData[refreshedData.length - 1]])
                }
                else if (refreshedData.length === serviceData.length) {
                    for (let i = 0; i < refreshedData.length; i++) {
                        if (!isEqual(refreshedData[i], serviceData[i])) {
                            let serviceDataCopy = [...serviceData]
                            let serviceDataValueCopy = { ...serviceData[i] }
                            serviceDataValueCopy = refreshedData[i]
                            serviceDataCopy[i] = serviceDataValueCopy
                            setServiceData(serviceDataCopy)
                        }
                        else {
                            return;
                        }
                    }
                }
                else {
                    console.log("Error retrieving service data. [ERR-INTERNAL]")
                    return;
                }
            }
        }
        else {
            setServiceData(response);
        }
        console.log("Service data recieved.")
    }

    const getOrderData = async (user_id, token) => {
        console.log("Fetching order data...")
        const response = await get(API_URL_ORDERS + `/${user_id}/${token}`);
        if (orderData.length > 0) {
            const refreshedData = response;
            let sameDataCheck1 = isEqual(refreshedData, orderData)
            let sameDataCheck2 = false;
            let checkArr = [];
            for (let i; i < refreshedData.length; i++) {
                if (isEqual(refreshedData[i].order_status, orderData[i].order_status)) {
                    checkArr.push(1);
                }
                else {
                    checkArr.push(0)
                }
            }
            if (checkArr.includes(0)) { sameDataCheck2 = false } else { sameDataCheck2 = true }
            if (sameDataCheck1 && sameDataCheck2) {
                return;
            }
            else {
                if (refreshedData.length > orderData.length) {
                    setOrderData([...orderData, refreshedData[refreshedData.length - 1]])
                }
                else if (refreshedData.length === orderData.length) {
                    let orderDataCopy;
                    orderDataCopy = [...orderData];
                    for (let i = 0; i < refreshedData.length; i++) {
                        orderDataCopy[i] = refreshedData[i];
                    }
                    setOrderData(orderDataCopy);
                }
                else {
                    console.log("Error retrieving order data. [ERR-INTERNAL]")
                    return;
                }
            }
        }
        else {
            setOrderData(response)
        }
    }

    const getClientData = async (user_id, token) => {
        console.log("Fetching client data...")
        const response = await get(API_URL_CLIENTS + `/${user_id}`);
        if (clientData.length > 0) {
            const refreshedData = response;
            setClientData(refreshedData);
        }
        else {
            setClientData(response);
        }
        console.log("Client data recieved.")
    }

    const refreshServiceData = (user_id, token) => {
        console.log("Refreshing service data...")
        getServiceData(user_id, token);
    }

    const refreshOrderData = (user_id, token) => {
        console.log("Refreshing order data...")
        getOrderData(user_id, token);
    }

    const refreshClientData = (user_id, token) => {
        console.log("Refreshing client data...")
        getClientData(user_id, token);
    }


    return (
        <serviceDataContext.Provider value={{
            serviceData,
            getServiceData,
            refreshServiceData,
            orderData,
            getOrderData,
            refreshOrderData,
            clientData,
            getClientData,
            refreshClientData
        }}>
            {props.children}
        </serviceDataContext.Provider>
    )
}
