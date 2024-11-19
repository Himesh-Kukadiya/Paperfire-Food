import { BsPencilFill, BsTrashFill, BsPlus } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    
    const getProducts = () => {
        axios.get('http://localhost:7575/api/admin/getProducts')
        .then(response => {
            setProducts(response.data)
        })
        .catch(error => console.error(error));
    }
    useEffect(() => {
        getProducts();
    }, []);

    const deleteProduct = (id) => {
        axios.delete(`http://localhost:7575/api/admin/deleteProduct/${id}`)
        .then((res) => {
            console.log(res)
            alert("Product deleted successfully!")
            getProducts();
        })
        .catch((err)=> console.error(err));
    }

    return (
        <section id='product' className='products-section'>
            <div className="container-fluid">
                <div className="d-flex justify-content-start mb-4">
                    <button className="btn btn-secondary">
                        <BsPlus className="me-2" /> Add New Product
                    </button>
                </div>
                <div className="table-container">
                    <table className="table table-striped text-light table-hover table-dark table-bordered">
                        <thead className="table-header">
                            <tr>
                                <th className='text-center'>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Rent Price</th>
                                <th>Quantity</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className='text-center'>{product.id}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:7575/Images/Products/${product.image[0]}`}
                                            alt="P"
                                            className="product-img"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.des}</td>
                                    <td>₹ {product.price}</td>
                                    <td>{`₹ ${product.rent}${product.time}`}</td>
                                    <td>{product.quantity}</td>
                                    <td className='text-center'>
                                        <button className="btn btn-icon" title="Edit">
                                            <BsPencilFill className='text-success' />
                                        </button>
                                        <button className="btn btn-icon" title="Delete"
                                        onClick={() => deleteProduct(product.id)}>
                                            <BsTrashFill className='text-danger' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Products;
