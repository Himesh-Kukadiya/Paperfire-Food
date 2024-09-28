import { about } from '../Script/assets';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <h2 className="section-title">About Us</h2>
                        <p className="section-description">{"At Paperfire Food, we specialize in providing high-quality restaurant equipment rental services. Our extensive inventory includes everything from kitchen appliances and cooking tools to dining furniture and refrigeration units. Whether you're setting up a new restaurant, hosting an event, or need additional equipment for peak times, we have the solutions to meet your needs."}</p>
                        <p className="section-description">{"Paperfire Food is your premier partner in restaurant equipment rental. We are dedicated to providing top-notch equipment to meet the diverse needs of restaurants, cafes, and catering services. Our commitment to quality and customer satisfaction ensures that you receive reliable and efficient solutions tailored to your specific requirements. With years of experience in the industry, we pride ourselves on offering a comprehensive range of equipment, exceptional customer service, and flexible rental terms to help your business thrive."}</p>
                    </div>
                    <div className="col-lg-6">
                        <img src={about} alt="About Us Image" className="img-fluid about-image" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About