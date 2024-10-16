import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Product from './Product';

const ProductDetails = () => {
    const { P_ID } = useParams();
    const deliveryDayse = 3;

    // first time scrolling function
    {
        var scrollToTop = () => {
            const element = document.getElementById('product-details');
            if (element) window.scrollTo({ top: element.offsetTop, behavior: 'smooth', });
        }
    }

    // Stetes
    {
        var [product, setProduct] = useState({});
        var [rent, setRent] = useState([]);
        var [productImages, setProductImages] = useState([]);
        var [quantity, setQuantity] = useState(1);
        var [available, setAvailable] = useState(0);
        var [fromDate, setFromDate] = useState(getDate(deliveryDayse));
        var [toDate, setToDate] = useState(getDate(deliveryDayse));
        var [days, setDays] = useState(1);
        var [quantityLimitError, setQuantityLimitError] = useState("");
        var [formData, setFormData] = useState({ name: "", email: "", mobile: "", address: "", city: "", state: "", zip: "" });
        var [formError, setFormError] = useState({ name: "", email: "", mobile: "", address: "", city: "", state: "", zip: "" });
        var [errors, setErrors] = useState(false);
    }

    // handle main image
    {
        var changeImage = (imageSrc) => {
            document.getElementById('mainImage').src = imageSrc;
        }
    }

    // get date.
    function getDate(daysAhead) {
        const today = new Date();
        today.setDate(today.getDate() + daysAhead);
        return today.toISOString().split('T')[0];
    }

    // helper functions
    {
        var showQuantityError = (message) => {
            setQuantityLimitError(message);
        };

        var resetQuantityError = () => {
            setQuantityLimitError("");
        };

        var validateAndCalculateDays = (from, to) => {
            const diffTime = new Date(to) - new Date(from);
            setDays(Math.ceil(diffTime / (1000 * 3600 * 24)) + 1);
        };

        var checkDateOverlap = (from1, to1, from2, to2) => {
            return (new Date(from1) <= new Date(to2) && new Date(to1) >= new Date(from2));
        };

        var calculateAvailableQuantity = () => {
            if (!rent.length) {
                setAvailable(product.quantity);
                resetQuantityError();
                return;
            }
        
            const unavailableQuantity = rent.reduce((total, r) => {
                const { fromDate: rentFrom, toDate: rentTo } = r;
        
                const adjustedFromDate = new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - deliveryDayse));
                const adjustedToDate = new Date(new Date(toDate).setDate(new Date(toDate).getDate() + deliveryDayse));
        
                const isOverlapping = checkDateOverlap(adjustedFromDate, adjustedToDate, rentFrom, rentTo);
                return total + (isOverlapping ? r.quantity : 0);
            }, 0);
        
            const availableQty = product.quantity - unavailableQuantity;
            setAvailable(availableQty);
        
            if (availableQty <= 0) {
                showQuantityError("No quantities available for the selected dates, including delivery days.");
            } else {
                resetQuantityError();
            }
        };        
    }

    // api calling functions
    {
        var fetchProductDetails = async () => {
            try {
                scrollToTop();
                const response = await axios.get(`http://localhost:7575/api/getProductDetails/${P_ID}`);
                setProduct(response.data.product);
                setProductImages(response.data.product.image);
                setRent(response.data.rent || []);
                setAvailable(response.data.product.quantity);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

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
                    const newFormData = { ...formData, fromDate, toDate, quantity };
                    newFormData.total = Number(days * product.rent * quantity);
                    newFormData.p_id = Number(P_ID);
                    newFormData.days = days;
                    newFormData.rent = product.rent;
                    // Send form data to the backend to get Razorpay options
                    const { data: { options } } = await axios.post(`http://localhost:7575/api/getOptions/`, newFormData);

                    const razor = new window.Razorpay({
                        ...options,
                        handler: function (response) {
                            // Handle payment success and send payment details for verification
                            axios.post(`http://localhost:7575/api/paymentVarification/${product._id}`, {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                data: newFormData,
                            })
                                .then(res => {
                                    console.log('Payment verification success:', res.data);
                                    alert('Payment Successful!');
                                    document.getElementById('btn-close').click();
                                })
                                .catch(err => {
                                    console.error('Payment verification error:', err);
                                    alert('Payment verification failed.');
                                    // Handle error UI changes here
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
                console.error("Error in booking product:", error);
                alert('Something went wrong during booking. Please try again.');
            }
        };
    }

    // handler functions
    {
        var increaseQuantity = () => {
            if (quantity < available) setQuantity(quantity + 1);
            else showQuantityError(`Only ${available} quantities available for the selected dates.`);
        };

        var decreaseQuantity = () => {
            if (quantity > 1) setQuantity(quantity - 1);
            else resetQuantityError();
        };

        var handleFormData = (e) => {
            const tag = e.target.name;
            const value = e.target.value;

            switch (tag) {
                case 'name':
                    if (value.length <= 2) setFormError({ ...formError, name: "*" })
                    else setFormError({ ...formError, name: "success" })
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setFormError({ ...formError, email: "*" })
                    else setFormError({ ...formError, email: "success" })
                    break;
                case 'mobile':
                    if (!/^[6-9]\d{9}$/.test(value)) setFormError({ ...formError, mobile: "*" })
                    else setFormError({ ...formError, mobile: "success" })
                    break;
                case 'address':
                    if (value.length <= 5) setFormError({ ...formError, address: "*" })
                    else setFormError({ ...formError, address: "success" })
                    break;
                case 'city':
                    if (value.length <= 2) setFormError({ ...formError, city: "*" })
                    else setFormError({ ...formError, city: "success" })
                    break;
                case 'state':
                    if (value.length <= 2) setFormError({ ...formError, state: "*" })
                    else setFormError({ ...formError, state: "success" })
                    break;
                case 'zip':
                    if (!/^\d{6}$/.test(value)) setFormError({ ...formError, zip: "*" })
                    else setFormError({ ...formError, zip: "success" })
                    break;
                default:
                    break;
            }
            setFormData({ ...formData, [tag]: value });
        }
    }

    // useEffects...
    {
        useEffect(() => { if (P_ID) fetchProductDetails(); }, [P_ID]);

        useEffect(() => { calculateAvailableQuantity(); }, [rent, fromDate, toDate]);

        useEffect(() => { validateAndCalculateDays(fromDate, toDate); }, [fromDate, toDate]);

        useEffect(() => {
            if (formError.name !== "success" || formError.email !== "success" || formError.mobile !== "success" || formError.address !== "success" || formError.city !== "success" || formError.state !== "success" || formError.zip !== "success")
                setErrors(true)
            else setErrors(false)
        }, [formError])
    }

    return (
        <>
            <section id="product-details">
                <div className="container my-5">
                    <div className="row">
                        {/* Image Gallery */}
                        <div className="col-lg-7 col-md-12 position-relative">
                            <div className="big-image-container mb-3 position-relative">
                                <img id="mainImage" src={`http://localhost:7575/Images/Products/${productImages[0]}`} className="img-fluid big-image" alt="Product Image" />
                                <div className="small-images d-flex justify-content-center position-absolute bottom-0 start-50 translate-middle-x mb-2">
                                    {productImages.map((img) => (
                                        <img
                                            src={`http://localhost:7575/Images/Products/${img}`}
                                            className="img-fluid small-image mx-2"
                                            alt={img}
                                            onClick={() => changeImage(`http://localhost:7575/Images/Products/${img}`)}
                                            key={img}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-lg-5 col-md-12">
                            <h2>{product.name}</h2>
                            <span className='mb-1'>{product.des}</span> <br />
                            <span className='mr-2 mb-1 mr-md-4 mr-lg-5'>₹ {product.rent} {product.time}</span>
                            <span className={`${available > 0 ? 'text-light' : 'text-danger'} mr-2 mr-md-4 mr-lg-5`}> Available :&ensp;<strong>{available}</strong> </span>
                            <span className="mb-1 d-block"> <i className="fa fa-truck"></i> Estimated delivery within <strong>{deliveryDayse} business days</strong>. </span>

                            <div className="rent-duration mb-3">
                                <label htmlFor="fromDate">From Date :</label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    value={fromDate}
                                    onChange={(e) => {
                                        const newDate = e.target.value;
                                        setFromDate(newDate);
                                        if (newDate > toDate) setToDate(newDate);
                                    }}
                                    className="form-control bg-transparent w-100 w-50"
                                    min={getDate(deliveryDayse)}
                                />

                                <label htmlFor="toDate">To Date :</label>
                                <input
                                    type="date"
                                    id="toDate"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="form-control bg-transparent w-100 w-50"
                                    min={fromDate}
                                />
                            </div>

                            <div className="quantity-section mb-1 d-flex align-items-center mt-1">
                                <label htmlFor="quantity" className="me-2">Quantity&ensp;:&ensp;</label>
                                <button className="btn btn-outline-light btn-sm" onClick={decreaseQuantity}>-</button>
                                <span className="mx-2">{quantity}</span>
                                <button className="btn btn-outline-light btn-sm me-3 mr-2" onClick={increaseQuantity}>+</button>
                                {quantityLimitError && <span className='text-danger'>{quantityLimitError}</span>}
                            </div>

                            <div className="total-amount-section mb-3">
                                <label htmlFor="totalAmount">Total Amount:</label>
                                <input
                                    type="text"
                                    id="totalAmount"
                                    value={String(product.rent * quantity * days)}
                                    className="form-control bg-transparent w-100 w-50"
                                    readOnly
                                />
                            </div>

                            <div className="action-buttons mb-3">
                                <button className="btn btn-secondary me-2"
                                    onClick={() => bookProduct}
                                    disabled={quantityLimitError || quantity === 0 || quantity > available}
                                    data-toggle="modal" data-target="#addressModal"
                                > Rent Now </button>
                                <button className="btn btn-secondary"
                                > Add to Cart </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <Product title={"Other Products You Might Like"} />
                </div>
            </section>

            {/* Modal for address details */}
            <div className="modal fade" id="addressModal" tabIndex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
                <div className="modal-dialog" style={{ boxShadow: "1px 1px 10px gray" }}>
                    <div className="modal-content" style={{ backgroundColor: 'black', color: 'white' }}>
                        <form onSubmit={bookProduct} method='post'>
                            <div className="modal-header" style={{ backgroundColor: 'black' }}>
                                <h3 className="modal-title" id="addressModalLabel">Address Information</h3>
                                <button type="button" id='btn-close' className="close" data-dismiss="modal" aria-label="Close" style={{ color: 'white' }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>Name</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" name='name' value={formData.name} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.name === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.name === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>Email</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="email" name='email' value={formData.email} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.email === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.email === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>Mobile</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="number" name='mobile' value={formData.mobile} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.mobile === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.mobile === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>Address</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" name='address' value={formData.address} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.address === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.address === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>City</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" name='city' value={formData.city} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.city === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.city === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>State</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" name='state' value={formData.state} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.state === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.state === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3">
                                        <label>Zip</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="number" name='zip' value={formData.zip} onChange={handleFormData} className='form-control bg-transparent' />
                                    </div>
                                    <div className="col-1 mt-2">
                                        {formError.zip === "*" ?
                                            <span className="material-icons text-danger">cancel</span> :
                                            formError.zip === "success" ? <span className="material-icons text-success">check_circle</span> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-secondary" style={{ backgroundColor: "lightgray", color: "black" }}
                                    disabled={errors}
                                >Go to payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
