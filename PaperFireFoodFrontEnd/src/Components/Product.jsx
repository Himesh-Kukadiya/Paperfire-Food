import { useState } from 'react';
import { productList } from '../Script/index';

const Product = () => {
    const [visibleProducts, setVisibleProducts] = useState(6);

    const loadMoreProducts = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 6);
    };

    return (
        <section id="products" className="products">
            <div className="container">
                <h2 className="section-title text-center">Our Equipment for Rent</h2>
                <div className="product-grid">
                    {productList.slice(0, visibleProducts).map((product) => (
                        <div className="product-card" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p className="description">{product.des}</p>
                            <p className="price">₹{product.price} {product.time}</p>
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
