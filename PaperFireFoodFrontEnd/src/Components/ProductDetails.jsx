import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from './Product';

const ProductDetails = () => {
    const { P_ID } = useParams();
    const deliveryDayse = 3;

    const scrollToTop = () => {
        const element = document.getElementById('product-details');
        if (element) window.scrollTo({ top: element.offsetTop, behavior: 'smooth', });
    };

    const [product, setProduct] = useState({});
    const [rent, setRent] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [available, setAvailable] = useState(0);
    const [fromDate, setFromDate] = useState(getDate(deliveryDayse));
    const [toDate, setToDate] = useState(getDate(deliveryDayse));
    const [days, setDays] = useState(1);
    const [quantityLimitError, setQuantityLimitError] = useState("");

    const changeImage = (imageSrc) => {
        document.getElementById('mainImage').src = imageSrc;
    };

    function getDate(daysAhead) {
        const today = new Date();
        today.setDate(today.getDate() + daysAhead);
        return today.toISOString().split('T')[0];
    }

    const showQuantityError = (message) => {
        setQuantityLimitError(message);
    };

    const resetQuantityError = () => {
        setQuantityLimitError("");
    };

    const validateAndCalculateDays = (from, to) => {
        const fromD = new Date(from);
        const toD = new Date(to);
        const diffTime = toD - fromD;
        setDays(Math.ceil(diffTime / (1000 * 3600 * 24)) + 1);
    };

    const checkDateOverlap = (from1, to1, from2, to2) => {
        return (new Date(from1) <= new Date(to2) && new Date(to1) >= new Date(from2));
    };

    const calculateAvailableQuantity = () => {
        if (!rent.length) {
            setAvailable(product.quantity);
            resetQuantityError();
            return;
        }

        const unavailableQuantity = rent.reduce((total, r) => {
            const { fromDate: rentFrom, toDate: rentTo } = r;
            const isOverlapping = checkDateOverlap(fromDate, toDate, rentFrom, rentTo);
            return total + (isOverlapping ? r.quantity : 0);
        }, 0);

        const availableQty = product.quantity - unavailableQuantity;
        setAvailable(availableQty);
        if (availableQty <= 0) showQuantityError("No quantities available for the selected dates.");
        else resetQuantityError();
    };

    const fetchProductDetails = async () => {
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

    const bookProduct = async (e) => { 
        try {
            e.preventDefault();
        }
        catch (error) {
            console.error("Error booking product:", error);
        }
    }

    const increaseQuantity = () => {
        if (quantity < available) setQuantity(quantity + 1);
        else showQuantityError(`Only ${available} quantities available for the selected dates.`);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
        else resetQuantityError();
    };

    useEffect(() => { if (P_ID) fetchProductDetails(); }, [P_ID]);

    useEffect(() => { calculateAvailableQuantity(); }, [rent, fromDate, toDate]);

    useEffect(() => { validateAndCalculateDays(fromDate, toDate); }, [fromDate, toDate]);

    return (
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
                        <span className='mr-2 mb-1 mr-md-4 mr-lg-5'>₹ {product.rant} {product.time}</span>
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
                                    if(newDate > toDate) setToDate(newDate);
                                }}
                                className="form-control bg-transparent w-50"
                                min={getDate(deliveryDayse)}
                            />

                            <label htmlFor="toDate">To Date :</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="form-control bg-transparent w-50"
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
                                value={String(product.rant * quantity * days)}
                                className="form-control bg-transparent w-50"
                                readOnly
                            />
                        </div>

                        <div className="action-buttons mb-3">
                            <button className="btn btn-secondary me-2"
                            onClick={() => bookProduct}
                            disabled={quantityLimitError || quantity === 0}>
                                Rent Now
                            </button>
                            <button className="btn btn-secondary">Add to Cart</button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <Product title={"Other Products You Might Like"} />
            </div>
        </section>
    );
};

export default ProductDetails;
