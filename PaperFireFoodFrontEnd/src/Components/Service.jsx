import { useEffect, useState } from "react";
import axios from 'axios';

const Service = () => {
    const [servicesList, setServicesList] = useState([]); // Initialize state

    useEffect(() => {
        axios.get("http://localhost:7575/api/getServices")
        .then(response => setServicesList(response.data))
        .catch(err => console.error("Error fetching services:", err));
    }, []);

    return (
        <section id="services" className="services-section">
            <div className="container">
                <h2 className="section-title text-center">Our Services</h2>
                <div className="row justify-content-center">
                    {servicesList.length > 0 ? (
                        servicesList.map((service) => (
                            <div key={service._id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                <div className="service-card flex-fill">
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No services available</p>  // Show a message if no services are fetched
                    )}
                </div>
            </div>
        </section>
    );
};

export default Service;