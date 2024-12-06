import { useEffect, useState } from "react"
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Users = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(localStorage.getItem("PFFAdminData") === null) {
            navigate("/");
        }
    }, [])
    
    useEffect(() => {
        axios.get("http://localhost:7575/api/admin/getUsers")
        .then(response => {
            setUsers(response.data)
        })
        .catch(error => console.error(`Error fetching users: ${error}`))
    })

    return (
        <>
            <section id="" className="products-section">
                <div className="container-fluid">
                    <div className="d-flex justify-content-start mb-4"></div>
                    <div className="table-container">
                        <table className="table table-striped text-light table-hover table-dark table-bordered">
                            <thead className="table-header">
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th style={{minWidth: 150}}>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Restaurant</th>
                                    <th style={{minWidth: 250}}>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><img src={`http://localhost:7575/Images/Users/${user.imageURL}`} alt="User" className="user-img" /></td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobile}</td>
                                        <td>{user.restaurant}</td>
                                        <td>{user.rAddress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Users