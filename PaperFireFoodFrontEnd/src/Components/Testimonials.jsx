import { useState } from 'react';
import PropTypes from 'prop-types';
import { testimonialsLsit } from "../Script/index";

const Testimonials = () => {
    // Split testimonials into chunks
    const chunkTestimonials = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const testimonialsChunks = chunkTestimonials(testimonialsLsit, 3);

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="section-title text-center">What Our Clients Say</h2>
                <div id="testimonialCarousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        {testimonialsChunks.map((chunk, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            >
                                <div className="row">
                                    {chunk.map((testimonial) => (
                                        <div className="col-lg-4 col-md-6" key={testimonial.id}>
                                            <div className="testimonial-card">
                                                <TruncatedText text={testimonial.cMessage} />
                                                <h5 className="client-name">- {testimonial.cName}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <a className="carousel-control-prev" href="#testimonialCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#testimonialCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

const TruncatedText = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const charLimit = 50; 
    const truncateText = (text, charLimit) => {
        if (text.length > charLimit) {
            return {
                truncated: true,
                text: text.slice(0, charLimit) + '...',
            };
        }
        return {
            truncated: false,
            text,
        };
    };

    const { truncated, text: truncatedText } = truncateText(text, charLimit);

    return (
        <p className="testimonial-text">
            {isExpanded || !truncated ? text : truncatedText}
            {truncated && !isExpanded && (
                <span className="read-more cursor-pointer text-primary" onClick={() => setIsExpanded(true)}>
                    {' '}read more
                </span>
            )}
        </p>
    );
};

// Define prop types for the TruncatedText component
TruncatedText.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Testimonials;
