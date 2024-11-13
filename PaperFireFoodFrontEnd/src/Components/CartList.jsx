
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from "axios";

import AddressModals from "../Components/BootstrapModal/Address.Modals"
import { validateEmail, validateMobile, validateZip } from "../Script/index";

const CartList = ({ cartItems, updateQuantity, removeFromCart }) => {
    const { userId } = useParams();
    let totalAmount = 0;

    const styleToCenter = { height: "100%", paddingTop: "4%" };
    const { standard, express, overnight } = { standard: 50, express: 70, overnight: 100 };

    const [shippingPrice, setShippingPrice] = useState(standard);
    const [formData, setFormData] = useState({ name: "", email: "", mobile: "", address: "", city: "", state: "", zip: "" });
    const [formError, setFormError] = useState({ name: "", email: "", mobile: "", address: "", city: "", state: "", zip: "" });
    const [errors, setErrors] = useState(false);
    const [isAddressRedy, setIsAddressRedy] = useState(false);

    const modalOpenRef = useRef(null)

    var handleFormData = (e) => {
        const tag = e.target.name;
        const value = e.target.value;

        switch (tag) {
            case 'name':
                if (value.length <= 2) setFormError({ ...formError, name: "Name must contains atleast 2 characters" })
                else setFormError({ ...formError, name: "success" })
                break;
            case 'email':
                if (validateEmail(value)) setFormError({ ...formError, email: "Invalid email address" })
                else setFormError({ ...formError, email: "success" })
                break;
            case 'mobile':
                if (validateMobile(value)) setFormError({ ...formError, mobile: "Invalid mobile pattern" })
                else setFormError({ ...formError, mobile: "success" })
                break;
            case 'address':
                if (value.length <= 5) setFormError({ ...formError, address: "Address must contains atleast 5 characters" })
                else setFormError({ ...formError, address: "success" })
                break;
            case 'city':
                if (value.length <= 2) setFormError({ ...formError, city: "City must contains atleast 2 characters" })
                else setFormError({ ...formError, city: "success" })
                break;
            case 'state':
                if (value.length <= 2) setFormError({ ...formError, state: "State must contains atleast 2 characters" })
                else setFormError({ ...formError, state: "success" })
                break;
            case 'zip':
                if (validateZip(value)) setFormError({ ...formError, zip: "invalid zip formate" })
                else setFormError({ ...formError, zip: "success" })
                break;
            default:
                break;
        }
        setFormData({ ...formData, [tag]: value });
    }

    useEffect(() => {
        if (formError.name !== "success" || formError.email !== "success" || formError.mobile !== "success" || formError.address !== "success" || formError.city !== "success" || formError.state !== "success" || formError.zip !== "success")
            setErrors(true)
        else setErrors(false)
    }, [formError])

    var bookProduct = async (e) => {
        e.preventDefault();
        try {
            // Validate the form fields
            if (formData.name === "") setFormError({ ...formError, name: "*" });
            else if (formData.email === "") setFormError({ ...formError, email: "*" });
            else if (formData.mobile === "") setFormError({ ...formError, mobile: "*" });
            else if (formData.address === "") setFormError({ ...formError, address: "*" });
            else if (formData.city === "") setFormError({ ...formError, city: "*" });
            else if (formData.state === "") setFormError({ ...formError, state: "*" });
            else if (formData.zip === "") setFormError({ ...formError, zip: "*" });
            else {
                setErrors(false)
                // Prepare form data
                const datas = {fromDate: [], toDate: [], quantity: [], total: [], pId: [], days: [], rent: []};

                cartItems.forEach((item) => {
                    datas.fromDate.push(item.fromDate);
                    datas.toDate.push(item.toDate);
                    datas.quantity.push(item.quantity);
                    datas.total.push(item.rent * item.quantity * item.days);
                    datas.pId.push(item.id);
                    datas.days.push(item.days);
                    datas.rent.push(item.rent);
                });

                const newFormData = { ...formData, uId: userId, ...datas, totalAmt: totalAmount, shippingPrice}

                // Send form data to the backend to get Razorpay options
                const { data: { options } } = await axios.post(`http://localhost:7575/api/getOptions/`, {totalAmt: newFormData.total.reduce((cur, acc) => {
                        return cur + acc;
                    }, 0)});

                const razor = new window.Razorpay({
                    ...options,
                    handler: function (response) {
                        // Handle payment success and send payment details for verification
                        axios.post(`http://localhost:7575/api/paymentVerification/${userId}`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            data: newFormData,
                        })
                            .then((res) => {
                                console.log('Payment verification success:', res.data);
                                alert('Payment Successful!');
                                document.getElementById('btn-close').click();
                            })
                            .catch(error => {
                                console.error(error.response.data.message);
                                alert('Payment verification failed.');
                            });
                    },
                    modal: {
                        escape: false,
                    },
                    theme: {
                        color: '#121212'
                    }
                });
                razor.open(); // Lonch Razorpay payment screen
            }
        } catch (error) {
            console.error("Error in booking product:", error.response.data.message);
            alert('Something went wrong during booking. Please try again.');
        }
    };

    return (
        <>
            <div className="modal fade" id="CartModal" tabIndex="-1" role="dialog" aria-labelledby="CartModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{ marginLeft: "7vw" }}>
                    <div className="modal-content" style={{ width: "86vw", boxShadow: "1px 1px 10px gray" }}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="CartModalLabel">Your Cart List</h5>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    {/* part 1 */}
                                    {cartItems.length === 0 ? (
                                        <div className="col-12 text-center pb-2">
                                            <h4> <i className="material-icons text-danger">error_outline</i>Your Cart is Empty!</h4>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-xl-8" >
                                                <>
                                                    <div className="row">
                                                        <div className="col-sm-7">
                                                            <h3>Shopping Cart</h3>
                                                        </div>
                                                        <div className="col-sm-5 text-right">
                                                            {cartItems.length} Items
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <table style={{ borderBottom: "1px solid white", borderTop: "2px solid white", maxHeight: "60", maxWidth: "80vw", }} className="table table-striped text-light">
                                                            <tbody>
                                                                {cartItems.map((ci) => {
                                                                    { totalAmount = totalAmount + (ci.rent * ci.quantity * ci.days) }
                                                                    return (
                                                                        <tr key={ci._id}>
                                                                            <th>
                                                                                <img src={`http://localhost:7575/Images/Products/${ci.image}`} alt={ci.image} style={{ height: 60, width: 60, borderRadius: "50%" }} />
                                                                            </th>
                                                                            <th style={styleToCenter}>{ci.name}</th>
                                                                            <th style={styleToCenter} >
                                                                                <button className="btn btn-primary btn-sm mx-2" onClick={() => updateQuantity(ci, -1)}> <i className="material-icons">remove</i></button>
                                                                                <span>{ci.quantity}</span>
                                                                                <button className="btn btn-primary btn-sm mx-2" onClick={() => ci.available > ci.quantity ? updateQuantity(ci, 1) : null}> <i className="material-icons">add</i></button>
                                                                            </th>
                                                                            <th style={styleToCenter}>₹ {ci.rent} {ci.time}</th>
                                                                            <th style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                                                <span>{ci.fromDate}</span>
                                                                                <span>to</span>
                                                                                <span>{ci.toDate}</span>
                                                                            </th>
                                                                            <th style={styleToCenter} className="text-danger">
                                                                                <span aria-hidden="true" style={{ cursor: "pointer" }} onClick={() => removeFromCart(ci)}>&times;</span>
                                                                            </th>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            </div>
                                            {/* part 2 */}
                                            <div className="col-xl-4" style={{ borderLeft: "1px solid white", height: "100" }}>
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col mt-2 " style={{ borderBottom: "2px solid white" }}><h4>Summary</h4></div>
                                                    </div>
                                                    <div className="row my-3">
                                                        <div className="col-sm-6 text-uppercase">items {cartItems.length}</div>
                                                        <div className="col-sm-6 text-right">₹ {totalAmount}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <h6 htmlFor="shipping" className="text-uppercase">Shipping</h6>
                                                                <select
                                                                    className="form-control text-light bg-transparent"
                                                                    id="shipping"
                                                                    name="shipping"
                                                                    onChange={(e) => {
                                                                        if (e.target.value === "standard") setShippingPrice(standard)
                                                                        else if (e.target.value === "express") setShippingPrice(express)
                                                                        else if (e.target.value === "overnight") setShippingPrice(overnight)
                                                                    }}
                                                                >
                                                                    <option value="standard">Standard Shipping ₹ {standard} </option>
                                                                    <option value="express">Express Shipping ₹ {express}</option>
                                                                    <option value="overnight">Overnight Shipping ₹ {overnight}</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <h6 htmlFor="zip" className="text-uppercase">Give Code</h6>
                                                                <input 
                                                                    type="number"
                                                                    className={`form-control text-light bg-transparent ${formError.zip && formError.zip !== 'success' ? 'is-invalid' : formError.zip === 'success' ? 'is-valid' : ''}`}
                                                                    id="zip"
                                                                    name="zip"
                                                                    value={formData.zip}
                                                                    onChange={handleFormData}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {cartItems && cartItems.length > 0
                                                        ? <>
                                                            <div className="row  mb-md-4 my-5 py-5"></div>
                                                            <div className="row pr-4" style={cartItems.length > 2 ? { borderTop: "2px solid white", width: "100%", position: "absolute", bottom: 0, paddingTop: "10px" } : { borderTop: "2px solid white", width: "100%", }}>
                                                                <div className="col-7 text-uppercase">
                                                                    total price
                                                                </div>
                                                                <div className="col-5 text-right">
                                                                    ₹ {cartItems.length > 1 ? totalAmount + shippingPrice : totalAmount}
                                                                </div>
                                                                <div className="col-12 col-md-0 my-xl-3"></div>
                                                                <div className="col-12">
                                                                    <button
                                                                        data-dismiss="modal" aria-label="Close"
                                                                        className="btn btn-primary text-uppercase form-control my-3"
                                                                        onClick={() => {
                                                                            setIsAddressRedy(true); 
                                                                            modalOpenRef.current.click()
                                                                        }}
                                                                    >Checkout</button>
                                                                </div>
                                                            </div>
                                                        </>
                                                        : null}
                                                </div>
                                            </div>
                                        </>)}
                                    <div className="row">
                                        <div className="col" >
                                            <span data-dismiss="modal" aria-label="Close" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><i className="material-icons">west</i> &ensp; Back to Home</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button style={{display: "none"}} data-toggle="modal" data-target="#addressModal" ref={modalOpenRef}></button>
            {isAddressRedy && <AddressModals bookProduct={bookProduct} formData={formData} formError={formError} handleFormData={handleFormData} errors={errors} />}
        </>
    );
}

CartList.propTypes = {
    cartItems: PropTypes.array.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired,
};

export default CartList;
