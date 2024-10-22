import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Product from './Product';
import AddressModals from './BootstrapModal/Address.Modals';

import {validateEmail, validateMobile, validateZip} from "../Script/index";

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
                    if (value.length <= 2) setFormError({ ...formError, name: "Name must contains atleast 2 characters"})
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
                                    disabled={quantityLimitError || quantity === 0 || quantity > available || fromDate < getDate(deliveryDayse) || toDate < getDate(deliveryDayse)}
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
            <AddressModals bookProduct={bookProduct} formData={formData} formError={formError} handleFormData={handleFormData} errors={errors} />
        </>
    );
};

export default ProductDetails;
