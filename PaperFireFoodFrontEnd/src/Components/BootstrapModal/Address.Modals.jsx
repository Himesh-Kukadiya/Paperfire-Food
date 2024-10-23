import PropTypes from 'prop-types';

const AddressModal = ({ handleFormData, formData, formError, bookProduct }) => {
    return (
        <div className="modal fade" id="addressModal" tabIndex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addressModalLabel">Address Information</h5>
                        <button type="button" id='btn-close' className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={bookProduct} method="post">
                        <div className="modal-body">
                            {/* Name Field */}
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${formError.name && formError.name !== 'success' ? 'is-invalid' : formError.name === 'success' ? 'is-valid' : ''}`}
                                    id="name"
                                    placeholder="What's Your Good Name?"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleFormData}
                                />
                                {formError.name && formError.name !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className={`form-control text-light bg-transparent ${formError.email && formError.email !== 'success' ? 'is-invalid' : formError.email === 'success' ? 'is-valid' : ''}`}
                                    id="email"
                                    placeholder="What's Your Email Address?"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleFormData}
                                />
                                {formError.email && formError.email !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.email}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Field */}
                            <div className="form-group">
                                <label htmlFor="mobile">Mobile</label>
                                <input
                                    type="number"
                                    className={`form-control text-light bg-transparent ${formError.mobile && formError.mobile !== 'success' ? 'is-invalid' : formError.mobile === 'success' ? 'is-valid' : ''}`}
                                    id="mobile"
                                    placeholder="What's Your Mobile Number?"
                                    name="mobile"
                                    required
                                    value={formData.mobile}
                                    onChange={handleFormData}
                                />
                                {formError.mobile && formError.mobile !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.mobile}
                                    </div>
                                )}
                            </div>

                            {/* Address Field */}
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${formError.address && formError.address !== 'success' ? 'is-invalid' : formError.address === 'success' ? 'is-valid' : ''}`}
                                    id="address"
                                    placeholder="What's Your Address?"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleFormData}
                                />
                                {formError.address && formError.address !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.address}
                                    </div>
                                )}
                            </div>

                            {/* City Field */}
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${formError.city && formError.city !== 'success' ? 'is-invalid' : formError.city === 'success' ? 'is-valid' : ''}`}
                                    id="city"
                                    placeholder="What's Your Good City?"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleFormData}
                                />
                                {formError.city && formError.city !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.city}
                                    </div>
                                )}
                            </div>

                            {/* State Field */}
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${formError.state && formError.state !== 'success' ? 'is-invalid' : formError.state === 'success' ? 'is-valid' : ''}`}
                                    id="state"
                                    placeholder="What's Your Good State?"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleFormData}
                                />
                                {formError.state && formError.state !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.state}
                                    </div>
                                )}
                            </div>

                            {/* Zip Field */}
                            <div className="form-group">
                                <label htmlFor="zip">Zip Code</label>
                                <input
                                    type="number"
                                    className={`form-control text-light bg-transparent ${formError.zip && formError.zip !== 'success' ? 'is-invalid' : formError.zip === 'success' ? 'is-valid' : ''}`}
                                    id="zip"
                                    placeholder="What's Your Zip Code?"
                                    name="zip"
                                    required
                                    value={formData.zip}
                                    onChange={handleFormData}
                                />
                                {formError.zip && formError.zip !== "success" && (
                                    <div className="invalid-feedback">
                                        {formError.zip}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" disabled={formError.hasErrors}>
                                Go to Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

AddressModal.propTypes = {
    handleFormData: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    formError: PropTypes.object.isRequired,
    bookProduct: PropTypes.func.isRequired,
};

export default AddressModal;
