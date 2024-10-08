import { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
    const loadmoreItems = 9;
    const [visibleProducts, setVisibleProducts] = useState(loadmoreItems);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:7575/api/getProducts')
        .then(response => setProductList(response.data))
        .catch(error => console.error(error));
    }, []);

    const loadMoreProducts = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + loadmoreItems);
    };

    return (
        <section id="products" className="products">
            <div className="container">
                <h2 className="section-title text-center">Our Equipment for Rent</h2>
                <div className="product-grid">
                    {productList.slice(0, visibleProducts).map((product) => (
                        <div className="product-card" key={product.id}>
                            <img src={`http://localhost:7575/Images/Products/${product.image}`} style={{maxHeight: 200}} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p className="description">{product.des}</p>
                            <p className="price">₹ {product.price} {product.time}</p>
                            <a href="#" className="btn">Rent Now</a>
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

export default Product;
