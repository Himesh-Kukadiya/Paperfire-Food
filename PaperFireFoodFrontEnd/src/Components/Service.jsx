import { servicesList } from '../Script/index';

const Service = () => {
    return (
        <section id="services" className="services-section">
            <div className="container">
                <h2 className="section-title text-center">Our Services</h2>
                <div className="row justify-content-center">
                    {servicesList.map((service, index) => (
                        <div key={index} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                            <div className="service-card flex-fill">
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Service;
