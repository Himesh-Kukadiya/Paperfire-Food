import {contact} from '../Script/assets';

const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-title text-center">Contact Us</h2>
                <div className="row">
                    <div className="col-lg-6">
                        <img src={contact} alt="Contact Us Image" className="img-fluid contact-image" />
                    </div>
                    <div className="col-lg-6">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name" className="text-light">Name</label>
                                <input type="text" className="form-control" id="name" placeholder="What's your good name ?"
                                    required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="text-light">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="What's your email ?"
                                    required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message" className="text-light">Message</label>
                                <textarea className="form-control" id="message" rows="5" placeholder="What's your message ?"
                                    required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact