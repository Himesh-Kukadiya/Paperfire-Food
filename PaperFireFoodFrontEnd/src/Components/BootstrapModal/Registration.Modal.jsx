import { useState } from "react";
import { validateEmail, validatePassword, validateMobile } from "../../Script";
import axios from "axios";

const RegistrationModal = () => {
    const [registrationData, setRegistrationData] = useState({});
    const [rePassword, setRePassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null); // Alert message state
    const [alertType, setAlertType] = useState(null); // Alert type state (success or danger)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (errors.name === "success" && errors.email === "success" && errors.password === "success" && errors.rePassword === "success" && errors.mobile === "success" && errors.restaurant === "success" && errors.rAddress === "success") {
            axios.post("http://localhost:7575/api/userRegistration", registrationData)
            .then((response) => {
                setAlertMessage("Registration Successful");
                setAlertType("success");
                localStorage.setItem("userDataPFF", JSON.stringify(response.data.data));
                window.location = `/${response.data.data._id}`
            })
            .catch((error) => {
                setAlertMessage(error.response?.data?.message || "Register failed. Please try again.");
                setAlertType("danger");
            });
        }
        else {
            alert("Fill Proper Data")
        }
    };

    const handleInputs = (e) => {
        const value = e.target.value;
        switch (e.target.name) {
            case "name":
                setErrors({
                    ...errors,
                    name: value.length < 2 ? "Name must contain at least 2 characters" : "success"
                });
                setRegistrationData({ ...registrationData, name: value });
                break;
            case 'email':
                setErrors({
                    ...errors,
                    email: validateEmail(value) ? "Invalid email" : "success"
                });
                setRegistrationData({ ...registrationData, email: value });
                break;
            case "password":
                setErrors({
                    ...errors,
                    password: validatePassword(value)
                        ? "success"
                        : "Password must contain an uppercase, lowercase, number, and special character"
                });
                setRegistrationData({ ...registrationData, password: value });
                break;
            case "rePassword":
                setRePassword(value);
                setErrors({
                    ...errors,
                    rePassword: value === registrationData.password ? "success" : "Passwords do not match"
                });
                break;
            case "mobile":
                setErrors({
                    ...errors,
                    mobile: validateMobile(value) ? "Invalid mobile number" : "success"
                });
                setRegistrationData({ ...registrationData, mobile: value });
                break;
            case "restaurant":
                setErrors({
                    ...errors,
                    restaurant: value.length <= 2 ? "*" : "success"
                });
                setRegistrationData({ ...registrationData, restaurant: value });
                break;
            case "rAddress":
                setErrors({
                    ...errors,
                    rAddress: value.length <= 5 ? "*" : "success"
                });
                setRegistrationData({ ...registrationData, rAddress: value });
                break;
            default:
                break;
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };
    
    return (
        <div
            className="modal fade"
            id="RegistrationModal"
            tabIndex="-1"
            aria-labelledby="RegistrationModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="RegistrationModalLabel">
                            User Registration
                        </h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Name Field */}
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${errors.name && errors.name !== 'success' ? 'is-invalid' : errors.name === 'success' ? 'is-valid' : ''}`}
                                    id="name"
                                    name="name"
                                    placeholder="What's Your Good Name?"
                                    onChange={handleInputs}
                                    required
                                />
                                {errors.name && errors.name !== "success" && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className={`form-control text-light bg-transparent ${errors.email && errors.email !== 'success' ? 'is-invalid' : errors.email === 'success' ? 'is-valid' : ''}`}
                                    id="email"
                                    placeholder="What's Your Email Address?"
                                    name="email"
                                    required
                                    onChange={handleInputs}
                                />
                                {errors.email && errors.email !== "success" && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-group position-relative">
                                <label htmlFor="password">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control text-light bg-transparent ${errors.password && errors.password !== 'success' ? 'is-invalid' : errors.password === 'success' ? 'is-valid' : ''}`}
                                    id="password"
                                    name="password"
                                    placeholder="What's Your Secret Password?"
                                    value={registrationData.password || ""}
                                    onChange={handleInputs}
                                    required
                                />
                                {errors.password && errors.password !== "success" && (
                                    <div className="invalid-feedback">
                                        {errors.password}
                                    </div>
                                )}
                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className="material-icons mt-1">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </i>
                                </span>
                            </div>

                            {/* Re-enter Password Field */}
                            <div className="form-group position-relative">
                                <label htmlFor="rePassword">Re-enter Password</label>
                                <input
                                    type={showRePassword ? "text" : "password"}
                                    className={`form-control text-light bg-transparent ${errors.rePassword && errors.rePassword !== 'success' ? 'is-invalid' : errors.rePassword === 'success' ? 'is-valid' : ''}`}
                                    id="rePassword"
                                    name="rePassword"
                                    placeholder="Re-enter Your Secret Password"
                                    value={rePassword || ""}
                                    onChange={handleInputs}
                                    required
                                />
                                {errors.rePassword && errors.rePassword !== "success" && (
                                    <div className="invalid-feedback">
                                        {errors.rePassword}
                                    </div>
                                )}
                                <span
                                    className="eye-icon"
                                    onClick={() => setShowRePassword(!showRePassword)}
                                >
                                    <i className="material-icons mt-1">
                                        {showRePassword ? "visibility_off" : "visibility"}
                                    </i>
                                </span>
                            </div>

                            {/* Mobile Field */}
                            <div className="form-group">
                                <label htmlFor="mobile">Mobile</label>
                                <input
                                    type="tel"
                                    className={`form-control text-light bg-transparent ${errors.mobile && errors.mobile !== 'success' ? 'is-invalid' : errors.mobile === 'success' ? 'is-valid' : ''}`}
                                    id="mobile"
                                    name="mobile"
                                    placeholder="What's Your Mobile Number?"
                                    value={registrationData.mobile || ""}
                                    onChange={handleInputs}
                                    required
                                />
                                {errors.mobile && errors.mobile !== "success" && (
                                    <div className="invalid-feedback">
                                        {errors.mobile}
                                    </div>
                                )}
                            </div>

                            {/* Restaurant Field */}
                            <div className="form-group">
                                <label htmlFor="restaurant">Restaurant</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${errors.restaurant && errors.restaurant !== 'success' ? 'is-invalid' : errors.restaurant === 'success' ? 'is-valid' : ''}`}
                                    id="restaurant"
                                    name="restaurant"
                                    placeholder="What's Your Restaurant's Good Name?"
                                    value={registrationData.restaurant || ""}
                                    onChange={handleInputs}
                                />
                            </div>

                            {/* Restaurant Address Field */}
                            <div className="form-group">
                                <label htmlFor="rAddress">Restaurant Address</label>
                                <input
                                    type="text"
                                    className={`form-control text-light bg-transparent ${errors.rAddress && errors.rAddress !== 'success' ? 'is-invalid' : errors.rAddress === 'success' ? 'is-valid' : ''}`}
                                    id="rAddress"
                                    name="rAddress"
                                    placeholder="What's Your Restaurant's Address?"
                                    value={registrationData.rAddress || ""}
                                    onChange={handleInputs}
                                />
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="form-group form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="termsConditions"
                                    onInvalid={(e) => e.target.setCustomValidity('You must agree with our terms and conditions to register.')}
                                    onInput={(e) => e.target.setCustomValidity('')} 
                                    required
                                />
                                <label className="form-check-label" htmlFor="termsConditions" style={{ color: '#fff' }}>
                                    I agree to the <a href="#" className="text-primary text-decoration-none">Terms & Conditions</a>
                                </label>
                            </div>

                            {/* Register Option for New Users */}
                            <div className="form-group">
                                <p>
                                    All ready have an account?
                                    <a href="#" id="switchToRegister" data-toggle="modal" data-target="#RegistrationModal" data-dismiss="modal" className="text-primary text-decoration-none"> Login here</a>
                                </p>
                            </div>

                            {/* Alert Message */}
                            {alertMessage && (
                                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                                    {alertMessage}
                                    <button type="button" className="close" onClick={closeAlert}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary"> Register Now </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;