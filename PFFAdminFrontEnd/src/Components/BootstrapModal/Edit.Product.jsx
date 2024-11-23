import React, { useState, useEffect, useRef } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import PropTypes from 'prop-types';
import axios from 'axios';

const EditProduct = ({ product }) => {
    const [productData, setProductData] = useState({});
    const [imageIndex, setImageIndex] = useState(-1);
    const [detaildImage, setDetaildImage] = useState("");
    const [errors, setErrors] = useState({name: "success", des: "success", price: "success", rent: "success", time: "success", quantity: "success"});

    const fileInputRef = useRef(null);

    useEffect(() => {
        setProductData(product);
    }, [product]);

    const handleInputs = (e) => {
        const { name, value } = e.target;
        if(name === "price" || name === "rent")
            setProductData({...productData, [name]: Number(value) });
        else 
            setProductData({ ...productData, [name]: value });

        switch (name) {
            case "name":
                setErrors({
                    ...errors,
                    name: value.length < 2 ? "Name must contain at least 2 characters" : "success",
                });
                break;
            case "des":
                setErrors({
                    ...errors,
                    des: value.length < 10 ? "Details must contain at least 10 characters" : "success",
                });
                break;
            case "price":
                setErrors({
                    ...errors,
                    price: Number(value) <= 0 ? "Price must greater then 0" : "success",
                });
                break;
            case "rent":
                setErrors({
                    ...errors,
                    rent: Number(value) <= 0 ? "Rent price must greater then 0" : "success",
                });
                break;
            case "time":
                setErrors({
                    ...errors,
                    time: value === "" ? "Time must greater then 0" : "success",
                });
                console.log(value)
                break;
            case "image":
            default:
                break;
        }
    };

    const handleQuantity = (e, quantity) => {
        e.preventDefault();
        if(quantity > 0)
            setProductData({...productData, quantity });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            errors.name === "success" &&
            errors.des === "success" &&
            errors.price === "success" &&
            errors.rent === "success" &&
            errors.time === "success" &&
            errors.quantity === "success"
        ) {
            // console.log(productData)
            axios.put(`http://localhost:7575/api/admin/updateProduct/${product._id}`, productData)
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("productImage", file);
            formData.append("_id", product._id);
            formData.append("index", imageIndex)
            formData.append("product", {name: product.name});

            axios.patch("http://localhost:7575/uploads/admin/editProductImage/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(response => {
                setProductData(response.data.product);
                setImageIndex(-1)
            })
            .catch(error => console.error("Error while uploading Product Image:", error));
        }
    }

    const handleDeleteImage = (index) => {
        const removed = product.image.splice(index, 1);
        axios.put(`http://localhost:7575/uploads/admin/deleteProductImage/${product._id}`,{product, removed: removed[0]})
        .then(response => {
            setProductData(response.data.product);
            setImageIndex(-1)
        })
        .catch(error => console.error("Error while deleting Product Image:", error));
    }

    if (!product.id) return null;
    return (
        <div className="modal fade" id="EditProduct" tabIndex="-1" aria-labelledby="EditProductLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="EditProductLabel">Edit Product</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {detaildImage === "" ? (
                            <>
                                <div className="modal-body">
                                    {/* Product Images */}
                                    <div className="mb-4 text-center position-relative">
                                        <div className="d-flex flex-wrap justify-content-center">
                                            {productData.image &&
                                                productData.image.map((img, index) => (
                                                    <div key={index} className="m-2 position-relative">
                                                        <img
                                                            className="rounded product-image"
                                                            src={`http://localhost:7575/Images/Products/${img}`}
                                                            alt=""
                                                            onClick={() =>
                                                                setDetaildImage(`http://localhost:7575/Images/Products/${img}`)
                                                            }
                                                        />
                                                        {/* Edit Icon */}
                                                        <span
                                                            className="edit-image-icon position-absolute"
                                                            style={{ bottom: '10px', right: '10px', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                setImageIndex(index)
                                                                fileInputRef.current.click()
                                                            }}
                                                        >
                                                            Edit
                                                        </span>
                                                        <span
                                                            className="remove-image-icon position-absolute"
                                                            style={{ bottom: '10px', right: '10px', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                handleDeleteImage(index)
                                                            }}
                                                        >
                                                            Delete
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="d-none"
                                            accept="image/*"
                                        />
                                    </div>

                                    {/* product name input */}
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="What's Your Product Name?"
                                            value={productData.name}
                                            onChange={handleInputs}
                                            className={`form-control text-light bg-transparent ${errors.name && errors.name !== 'success' ? 'is-invalid' : errors.name === 'success' ? 'is-valid' : ''}`}
                                        />
                                        {errors.name && errors.name !== 'success' && <small className="text-danger">{errors.name}</small>}
                                    </div>

                                    {/* product description input */}
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            name="des"
                                            placeholder="What's Your Product Desciption?"
                                            value={productData.des}
                                            onChange={handleInputs}
                                            className={`form-control text-light bg-transparent ${errors.des && errors.des !== 'success' ? 'is-invalid' : errors.des === 'success' ? 'is-valid' : ''}`}
                                        />
                                        {errors.des && errors.des !== 'success' && <small className="text-danger">{errors.des}</small>}
                                    </div>

                                    {/* product Price input */}
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="What's the Cost Of Product?"
                                            value={productData.price}
                                            onChange={handleInputs}
                                            className={`form-control text-light bg-transparent ${errors.price && errors.price !== 'success' ? 'is-invalid' : errors.price === 'success' ? 'is-valid' : ''}`}
                                        />
                                        {errors.price && errors.price !== 'success' && <small className="text-danger">{errors.price}</small>}
                                    </div>

                                    {/* product Rent input */}
                                    <div className="form-group">
                                        <label>Rent</label>
                                        <input
                                            type="number"
                                            name="rent"
                                            placeholder="What's the cost of product to rent?"
                                            value={productData.rent}
                                            onChange={handleInputs}
                                            className={`form-control text-light bg-transparent ${errors.rent && errors.rent !== 'success' ? 'is-invalid' : errors.rent === 'success' ? 'is-valid' : ''}`}
                                        />
                                        {errors.rent && errors.rent !== 'success' && <small className="text-danger">{errors.rent}</small>}
                                    </div>

                                    {/* product Rent Time input */}
                                    <div className="form-group">
                                        <label>Time</label>
                                        <select
                                            name="time"
                                            placeholder="What's the Cost Of Product?"
                                            value={productData.time}
                                            onChange={handleInputs}
                                            className={`form-control text-light bg-transparent ${errors.time && errors.time !== 'success' ? 'is-invalid' : errors.time === 'success' ? 'is-valid' : ''}`}
                                        >
                                            <option value="">Select Time</option>
                                            <option value=" / hour">/ hour</option>
                                            <option value=" / day">/ day</option>
                                            <option value=" / month">/ month</option>
                                        </select>
                                        {errors.time && errors.time !== 'success' && <small className="text-danger">{errors.time}</small>}
                                    </div>

                                    {/* product Quantity input */}
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <div className='d-flex justify-content-between align-items-center w-25'>
                                            <button className='btn btn-light font-weight-bold' style={{width: 40}}
                                            onClick={(e) => handleQuantity(e, productData.quantity - 1)}>-</button>
                                            <span>{productData.quantity}</span>
                                            <button className='btn btn-light font-weight-bold' style={{width: 40}}
                                            onClick={(e) => handleQuantity(e, productData.quantity + 1)}>+</button>
                                        </div>
                                        {errors.rent && errors.rent !== 'success' && <small className="text-danger">{errors.rent}</small>}
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-light"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setImageIndex(product.image.length)
                                        fileInputRef.current.click()
                                    }}>
                                        Add new Image
                                    </button>
                                    <button type="submit" className="btn btn-light">
                                        Update Now
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Full-Size Image View */}
                                <div className="modal-body text-center">
                                    <img
                                        className="rounded product-detail-image"
                                        src={detaildImage}
                                        alt="Detailed View"
                                        style={{ width: "100%", cursor: "pointer" }}
                                        onClick={() => setDetaildImage("")} // Return to gallery view
                                    />
                                </div>
                                <div className="modal-footer">
                                    <a style={{ cursor: "pointer" }}
                                        onClick={() => setDetaildImage("")}
                                    >
                                        <BsArrowLeft /> Back to Gallery
                                    </a>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

EditProduct.propTypes = {
    product: PropTypes.object.isRequired,
};

export default EditProduct;
