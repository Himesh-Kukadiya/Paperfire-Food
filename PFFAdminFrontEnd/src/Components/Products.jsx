import { BsPencilFill, BsTrashFill, BsPlus } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import EditProduct from './BootstrapModal/Edit.Product';
import AddProductModal from './BootstrapModal/Add.Product.Modal';
import {useNavigate} from "react-router-dom"

const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null); // Initialize as `null`
    const openEditProductModal = useRef(null);

    useEffect(() => {
        if(localStorage.getItem("PFFAdminData") === null) {
            navigate("/");
        }
    }, [])
    
    // Fetch products
    const getProducts = () => {
        axios
            .get('http://localhost:7575/api/admin/getProducts')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Handle product editing
    const editProductHandle = (product) => {
        setEditProduct(product);
    };

    useEffect(() => {
        if (editProduct) {
            openEditProductModal.current.click();
        }
    }, [editProduct]);

    // Delete product
    const deleteProduct = (id) => {
        axios
            .delete(`http://localhost:7575/api/admin/deleteProduct/${id}`)
            .then(() => {
                alert('Product deleted successfully!');
                getProducts();
            })
            .catch((err) => console.error(err));
    };

    return (
        <section id="product" className="products-section">
            <div className="container-fluid">
                <div className="d-flex justify-content-start mb-4">
                    <button className="btn btn-secondary"
                        data-toggle="modal"
                        data-target="#AddProductModal"
                    >
                        <BsPlus className="me-2" /> Add New Product
                    </button>
                </div>
                <div className="table-container">
                    <table className="table table-striped text-light table-hover table-dark table-bordered">
                        <thead className="table-header">
                            <tr>
                                <th className="text-center">#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Rent Price</th>
                                <th>Quantity</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="text-center">{product.id}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:7575/Images/Products/${product.image[0]}`}
                                            alt="Product"
                                            className="product-img"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.des}</td>
                                    <td>₹ {product.price}</td>
                                    <td>{`₹ ${product.rent}${product.time}`}</td>
                                    <td>{product.quantity}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-icon"
                                            title="Edit"
                                            onClick={() => editProductHandle(product)}
                                        >
                                            <BsPencilFill className="text-success" />
                                        </button>
                                        <button
                                            className="btn btn-icon"
                                            title="Delete"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            <BsTrashFill className="text-danger" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Hidden button to trigger modal */}
            <button
                ref={openEditProductModal}
                data-toggle="modal"
                data-target="#EditProduct"
                style={{ display: 'none' }}
            >
                Open Edit Product Modal
            </button>
            {/* Conditionally render EditProduct modal */}
            {editProduct && <EditProduct product={editProduct} />}
            <AddProductModal productId={products.length > 0 ? products[products.length - 1].id + 1 : 1} setProducts={setProducts} />
        </section>
    );
};

export default Products;
