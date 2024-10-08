import { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
    const [galleryList, setGalleryList] = useState([]);
    const [visibleImages, setVisibleImages] = useState(6); 

    const loadMoreImages = () => {
        setVisibleImages((prevVisibleImages) => prevVisibleImages + 6);
    };

    useEffect(() => {
        axios.get('http://localhost:7575/api/getGallery')
        .then(response => setGalleryList(response.data))
        .catch(err => console.error("Error fetching gallery images:", err));
    }, []);
    return (
        <section id="gallery" className="gallery-section">
            <div className="container">
                <h2 className="section-title text-center">Our Gallery</h2>
                <div className="row">
                    {
                        galleryList.slice(0, visibleImages).map(gallery => (
                            <div className="col-lg-4 col-md-6" key={gallery.id}>
                                <div className="gallery-item">
                                    <img src={`http://localhost:7575/Images/Gallary/${gallery.image}`} alt={`Gallery Image ${gallery.id}`} className="img-fluid" />
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
