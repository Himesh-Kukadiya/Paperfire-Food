import { useState } from "react";
import { galleryList } from "../Script/index";

const Gallery = () => {
    const [visibleImages, setVisibleImages] = useState(6); 

    const loadMoreImages = () => {
        setVisibleImages((prevVisibleImages) => prevVisibleImages + 6);
    };

    return (
        <section id="gallery" className="gallery-section">
            <div className="container">
                <h2 className="section-title text-center">Our Gallery</h2>
                <div className="row">
                    {
                        galleryList.slice(0, visibleImages).map(gallery => (
                            <div className="col-lg-4 col-md-6" key={gallery.id}>
                                <div className="gallery-item">
                                    <img src={gallery.image} alt={`Gallery Image ${gallery.id}`} className="img-fluid" />
                                </div>
                            </div>
                        ))
                    }
                </div>
                {visibleImages < galleryList.length && (
                    <div className="text-center">
                        <button onClick={loadMoreImages} className="btn btn-primary">Load More</button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Gallery;
