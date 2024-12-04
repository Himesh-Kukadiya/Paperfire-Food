import { useEffect, useState } from "react";
import { BsPlus, BsTrashFill, BsPencilFill, BsClockHistory, BsXCircle, BsCheckCircle } from "react-icons/bs";
import axios from "axios";
const Orders = () => {
    const [refresh, setRefresh] = useState(false);
    const [rents, setRents] = useState([]);
    const [filteredRents, setFilteredRents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:7575/api/admin/getRents')
            .then(response => {
                setRents(response.data)
                setFilteredRents(response.data)
            })
            .catch(error => console.error('Error:', error));
    }, [refresh])

    const handleStatus = (id, status, uId) => {
        axios.patch('http://localhost:7575/api/admin/updateStatus', {id, status, uId})
        .then(response => {
            setRefresh(!refresh)
        })
        .catch(error => console.error('Error:', error));
    } 
    

    const handleFilterOnTime = (e) => {
        let val = e.target.value;

        const today = new Date();
        let from, to;

        if(val === "today") {
            from = to = today.toISOString().split("T")[0];
            setFilteredRents(filterData(from, to))
        }
        else if(val === "week") {
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            from = weekStart.toISOString().split("T")[0];
            to = weekEnd.toISOString().split("T")[0];
            
            setFilteredRents(filterData(from, to))
        }
        else if(val === "month") {
            from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
            to = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

            setFilteredRents(filterData(from, to))
        }
        else if(val === "year") {
            from = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
            to = new Date(today.getFullYear(), 11, 31).toISOString().split("T")[0];

            setFilteredRents(filterData(from, to))
        }
        else if(val === "all") {
            setFilteredRents(rents);
        }
    }

    const filterData = (from, to) => {
        const filteredData = rents.filter(rent => 
            rent.products.some(product => 
                new Date(product.fromDate) >= new Date(from) && new Date(product.fromDate) <= new Date(to) || new Date(product.toDate) >= new Date(from) && new Date(product.toDate) <= new Date(to)
            )
        );
        return filteredData;
    };


    return (
        <section id="product" className="products-section">
            <div className="container-fluid">
                <div className="d-flex justify-content-start mb-4">
                    <select className="dropdown btn btn-light dropdown-toggle" name="filterOnTime" onChange={handleFilterOnTime} id="">
                        <option className="dropdown-item" value="">-Select-</option>
                        <option className="dropdown-item" value="today">Today</option>
                        <option className="dropdown-item" value="week">This Week</option>
                        <option className="dropdown-item" value="month">This Month</option>
                        <option className="dropdown-item" value="year">This Year</option>
                        <option className="dropdown-item" value="all">All Rents</option>
                    </select>
                </div>
                <div className="table-container" style={{ overflowX: "auto" }}>
                    <table className="table table-striped text-light table-hover table-dark table-bordered">
                        <thead className="table-header">
                            <tr>
                                <th className="text-center">#</th>
                                <th>Id's</th>
                                <th style={{ minWidth: 700 }}>Products</th>
                                <th style={{ width: "115px" }}>Mobile</th>
                                <th style={{ maxWidth: 200, minWidth: 180 }}>Address</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredRents.length > 0 
                            ? filteredRents.map((rent, index) => (
                                <tr key={rent.id + index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-left">
                                        <div className="form-group">
                                            <label className="font-weight-bold">Order Id: </label>
                                            <div>{rent.id}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-bold">User Id: </label>
                                            <div>{rent.uId}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <table style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Img</th>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Rent</th>
                                                    <th>Rent Period</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rent.products.map((product, index) => (
                                                    <tr key={`${index}-${rent.id}`}>
                                                        <td className="text-center">{product.id}</td>
                                                        <td className="text-center"><img className="product-img" src={product.img} alt="p" width={30} height={30} style={{ objectFit: "cover" }} /></td>
                                                        <td className="text-center">{product.name}</td>
                                                        <td className="text-center">{product.quantity}</td>
                                                        <td className="text-center">{`${product.rent}${product.time}`}</td>
                                                        <td className="text-center d-flex flex-column"><span>{product.fromDate} To</span> <span>{product.toDate}</span></td>
                                                        <td className="text-center">{product.total}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <th className="text-right" colSpan={6}>Grand Total: </th>
                                                    <td>{rent.GTotal}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* <td className="text-center">{rent.GTotal}</td> */}
                                    <td className="text-center">{rent.mobile}</td>
                                    <td className="text-center" style={{ maxWidth: 150, textWrap: "wrap" }}>
                                        {`${rent.address}, ${rent.city}, ${rent.state}, ${rent.zip}`}
                                    </td>
                                    <td className={rent.status === "Pending" ? "text-warning" : rent.status === "Accepted" ? "text-success" : "text-danger"}>{rent.status}</td>
                                    <td className="text-center">
                                        {rent.status === "Pending" ? (
                                            // status is "Pending"
                                            <>
                                                <button className="btn btn-success mx-1"
                                                onClick={()=>handleStatus(rent.id, "Accepted", rent.uId)}>
                                                    <BsCheckCircle /> 
                                                </button>
                                                <button className="btn btn-danger mx-1"
                                                onClick={()=>handleStatus(rent.id, "Rejected", rent.uId)}>
                                                    <BsXCircle /> 
                                                </button>
                                            </>
                                        ) : rent.status === "Accepted" ? (
                                            // status is "Accepted"
                                            <>
                                                <button className="btn btn-warning mx-1"
                                                onClick={()=>handleStatus(rent.id, "Pending", rent.uId)}>
                                                    <BsClockHistory /> 
                                                </button>
                                                <button className="btn btn-danger mx-1"
                                                onClick={()=>handleStatus(rent.id, "Rejected", rent.uId)}>
                                                    <BsXCircle /> 
                                                </button>
                                            </>
                                        ) : (
                                            // Status is "Rejected"
                                            <>
                                                <button className="btn btn-success mx-1"
                                                onClick={()=>handleStatus(rent.id, "Accepted", rent.uId)}>
                                                    <BsCheckCircle /> 
                                                </button>
                                                <button className="btn btn-warning mx-1"
                                                onClick={()=>handleStatus(rent.id, "Pending", rent.uId)}>
                                                    <BsClockHistory /> 
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>))
                            : (
                                <tr>
                                    <td colSpan={9}>No rents found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            {/* Hidden button to trigger modal */}
            <button
                data-toggle="modal"
                data-target="#EditProduct"
                style={{ display: 'none' }}
            >
                Open Edit Product Modal
            </button>
        </section>
    );
}

export default Orders