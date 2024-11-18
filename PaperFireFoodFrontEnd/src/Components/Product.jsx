import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

const Product = ({ title }) => {
    const loadmoreItems = 9;
    const { userId } = useParams() || "";

    const [visibleProducts, setVisibleProducts] = useState(loadmoreItems);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:7575/api/getProducts')
            .then(response => {
                setProductList(response.data)
            })
            .catch(error => console.error(error));
    }, []);

    const loadMoreProducts = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + loadmoreItems);
    };

    return (
        <section id="products" className="products">
            <div className="container">
                <h2 className="section-title text-center">{title}</h2>
                <div className="product-grid">
                    {productList.slice(0, visibleProducts).map((product) => (
                        <div className="product-card" key={product.id}>
                            <img src={`http://localhost:7575/Images/Products/${product.image[0]}`} style={{maxHeight: 200}} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p className="description">{product.des}</p>
                        <p className="price mb-5 pb-2">₹ {product.rent} {product.time}</p>
                            <Link to={userId ? `/${userId}/ProductDetails/${product.id}` : `/ProductDetails/${product.id}`} className="btn">Rent Now</Link>
                        </div>
                    ))}
                </div>
                {visibleProducts < productList.length && (
                    <div className="text-center">
                        <button onClick={loadMoreProducts} className="btn btn-primary">Load More</button>
                    </div>
                )}
            </div>
        </section>
    );
};

Product.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Product;
