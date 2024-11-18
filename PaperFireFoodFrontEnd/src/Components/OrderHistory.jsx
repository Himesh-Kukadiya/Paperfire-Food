import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const OrderHistory = () => {
    const { userId } = useParams();
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:7575/api/getRents/${userId}`)
            .then((response) => {
                setOrderData(response.data)
            })
            .catch((error) => {
                console.error(`Error fetching order history for user ${userId}:`, error)
            })
    }, [])
    return (
        <>
            <section id="order-history">
                {orderData.length === 0
                    ? <>
                        <div className="d-flex flex-column justify-between align-items-center" style={{ fontSize: 22, lineHeight: "1" }}>
                            <p style={{ fontSize: 40 }}>No orders found!</p>
                            <p>{"You haven't placed any orders yet."}</p>
                            <p>{'Click on the "Products" Menu in the navigation bar to start renting a food item.'}</p>
                        </div>
                    </>
                    : <>
                        {/* Display order history */}
                        <div className="container">
                            <h2 className="section-title text-center"> My Orders </h2>
                            <div className="row orders">
                                {orderData.map((od, index) => (
                                    <div key={(String(od.pId) + String(index))} className="col-lg-4 col-md-6 my-3">
                                        <div className="container border rounded d-flex flex-column align-items-center">
                                            <img src={`http://localhost:7575/Images/Products/${od.image}`} alt="P" style={{height: "60px", width: "60px"}} className="img rounded-circle mt-4" />
                                            <h2 className="mt-2">{od.pName}</h2>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>Order ID:</th>
                                                        <td className="pl-2">{od._id}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>rent Period:</th>
                                                        <td className="pl-2">{od.fromDate} To {od.toDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Rent Of:</th>
                                                        <td className="pl-2">₹ {od.rent}{od.time}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Quantity:</th>
                                                        <td className="pl-2" >{od.quantity}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total:</th>
                                                        <td className="pl-2">{od.total}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Status:</th>
                                                        <td className={od.status === "Pending" ? "text-warning": od.status === "Accepted" ? "text-success" : "text-danger"}>{od.status}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                }
            </section>
        </>
    )
}

export default OrderHistory