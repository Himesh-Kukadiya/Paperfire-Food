import { useState, useRef, useEffect } from "react";
import { validateEmail, validatePassword, validateMobile } from "../../Script";
import axios from "axios";
import EmailVerificationModal from "./EmailVerification.Modal";

const RegistrationModal = () => {
    const [registrationData, setRegistrationData] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
        mobile: "",
        restaurant: "",
        rAddress: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null); 
    const [alertType, setAlertType] = useState(null); 

    const emailVerificationRef = useRef(null);
    const registrationCloseRef = useRef(null);

    useEffect(() => { if(isRegistered) emailVerificationRef.current.click(); }, [isRegistered])
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            errors.name === "success" &&
            errors.email === "success" &&
            errors.password === "success" &&
            errors.rePassword === "success" &&
            errors.mobile === "success" &&
            errors.restaurant === "success" &&
            errors.rAddress === "success"
        ) {
            axios
                .post("http://localhost:7575/api/userRegistration", registrationData)
                .then((response) => {
                    console.log(response.data);
                    setIsRegistered(true);
                    registrationCloseRef.current.click();
                })
                .catch((error) => {
                    setAlertMessage(error.response.data.message);
                    setAlertType("danger");
                    console.error(error.response.data.message);
                });
        } else {
            alert("Please fill out all fields correctly.");
        }
    };

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setRegistrationData({ ...registrationData, [name]: value });

        switch (name) {
            case "name":
                setErrors({
                    ...errors,
                    name: value.length < 2 ? "Name must contain at least 2 characters" : "success",
                });
                break;
            case "email":
                setErrors({
                    ...errors,
                    email: validateEmail(value) ? "Invalid email" : "success",
                });
                break;
            case "password":
                setErrors({
                    ...errors,
                    password: validatePassword(value)
                        ? "success"
                        : "Password must contain an uppercase, lowercase, number, and special character",
                });
                break;
            case "rePassword":
                setErrors({
                    ...errors,
                    rePassword: value === registrationData.password ? "success" : "Passwords do not match",
                });
                break;
            case "mobile":
                setErrors({
                    ...errors,
                    mobile: validateMobile(value) ? "Invalid mobile number" : "success",
                });
                break;
            case "restaurant":
                setErrors({
                    ...errors,
                    restaurant: value.length <= 2 ? "Restaurant name too short" : "success",
                });
                break;
            case "rAddress":
                setErrors({
                    ...errors,
                    rAddress: value.length <= 5 ? "Address too short" : "success",
                });
                break;
            default:
                break;
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };

    return (
        <>
            <div className="modal fade" id="RegistrationModal" tabIndex="-1" aria-labelledby="RegistrationModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="RegistrationModalLabel">User Registration</h5>
                            <button ref={registrationCloseRef} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Name Field */}
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="What's Your Good Name?"
                                        value={registrationData.name}
                                        onChange={handleInputs}
                                        className={`form-control text-light bg-transparent ${errors.name && errors.name !== 'success' ? 'is-invalid' : errors.name === 'success' ? 'is-valid' : ''}`}
                                    />
                                    {errors.name && errors.name !== 'success' && <small className="text-danger">{errors.name}</small>}
                                </div>

                                {/* Email Field */}
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="What's Your Email Address?"
                                        value={registrationData.email}
                                        onChange={handleInputs}
                                        className={`form-control text-light bg-transparent ${errors.email && errors.email !== 'success' ? 'is-invalid' : errors.email === 'success' ? 'is-valid' : ''}`}
                                    />
                                    {errors.email && errors.email !== 'success' && <small className="text-danger">{errors.email}</small>}
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
                                    {errors.password && errors.password !== 'success' && <small className="text-danger">{errors.password}</small>}
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
                                        value={registrationData.rePassword || ""}
                                        onChange={handleInputs}
                                        required
                                    />
                                    {errors.rePassword && errors.rePassword !== 'success' && <small className="text-danger">{errors.rePassword}</small>}
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
                                    <label>Mobile</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        placeholder="What's Your Mobile Number?"
                                        value={registrationData.mobile}
                                        onChange={handleInputs}
                                        className={`form-control text-light bg-transparent ${errors.mobile && errors.mobile !== 'success' ? 'is-invalid' : errors.mobile === 'success' ? 'is-valid' : ''}`}
                                    />
                                    {errors.mobile && errors.mobile !== 'success' && <small className="text-danger">{errors.mobile}</small>}
                                </div>

                                {/* Restaurant Field */}
                                <div className="form-group">
                                    <label>Restaurant Name</label>
                                    <input
                                        type="text"
                                        name="restaurant"
                                        placeholder="What's Your Restaurant's Good Name?"
                                        value={registrationData.restaurant}
                                        onChange={handleInputs}
                                        className={`form-control text-light bg-transparent ${errors.restaurant && errors.restaurant !== 'success' ? 'is-invalid' : errors.restaurant === 'success' ? 'is-valid' : ''}`}
                                    />
                                    {errors.restaurant && errors.restaurant !== 'success' && <small className="text-danger">{errors.restaurant}</small>}
                                </div>

                                {/* Address Field */}
                                <div className="form-group">
                                    <label>Restaurant Address</label>
                                    <input
                                        type="text"
                                        name="rAddress"
                                        placeholder="What's Your Restaurant Address?"
                                        value={registrationData.rAddress}
                                        onChange={handleInputs}
                                        className={`form-control text-light bg-transparent ${errors.rAddress && errors.rAddress !== 'success' ? 'is-invalid' : errors.rAddress === 'success' ? 'is-valid' : ''}`}
                                    />
                                    {errors.rAddress && errors.rAddress !== 'success' && <small className="text-danger">{errors.rAddress}</small>}
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

            {/* Hidden button to trigger Email Verification Modal */}
            <button
                type="button"
                ref={emailVerificationRef}
                style={{ display: "none" }}
                data-toggle="modal"
                data-target="#EmailVerificationModal"
            ></button>

            {/* Email Verification Modal */}
            {isRegistered && (
                <EmailVerificationModal email={registrationData.email} modalType="Email Verification" userData={registrationData} name={registrationData.name} />
            )} 
        </>
    );
};

export default RegistrationModal;
