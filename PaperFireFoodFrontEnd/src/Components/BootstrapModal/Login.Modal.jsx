import { useState, useEffect, useRef } from "react";
import { validateEmail, validatePassword } from "../../Script";
import axios from "axios";
import EmailVerificationModal from "./EmailVerification.Modal";

const LoginModal = () => {
    const [loginData, setLoginData] = useState({});
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [forgetPasswordStatus, setForgetPasswordStatus] = useState(false);

    const modalOpenRef = useRef(null);

    const handleInputs = (e) => {
        const value = e.target.value;

        switch (e.target.name) {
            case 'email':
                setErrors({ ...errors, email: validateEmail(value) ? "Invalid email" : "success" });
                setLoginData({ ...loginData, email: value });
                break;
            case 'password':
                setErrors({ ...errors, password: validatePassword(value) ? "success" : <>password must have one upper, one lower, one number or one special character</> });
                setLoginData({ ...loginData, password: value });
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (errors.email === "success" && errors.password === "success") {
            axios.post("http://localhost:7575/api/userLogin", loginData)
                .then((response) => {
                    setAlertMessage("Login Successful");
                    setAlertType("success");
                    localStorage.setItem("userDataPFF", JSON.stringify(response.data.data));
                    window.location = `/${response.data.data._id}`
                })
                .catch((error) => {
                    setAlertMessage(error.response?.data?.message || "Login failed. Please try again.");
                    setAlertType("danger");
                });
        } else {
            setAlertMessage("Please fill in all required fields correctly.");
            setAlertType("danger");
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };

    useEffect(() => { modalOpenRef.current.click(); }, [forgetPasswordStatus])

    return (
        <>
            <div className="modal fade" id="LoginModal" tabIndex="-1" aria-labelledby="LoginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="LoginModalLabel">User Login</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form method="post" onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control text-light bg-transparent ${errors.email && errors.email !== 'success' ? 'is-invalid' : errors.email === 'success' ? 'is-valid' : ''}`}
                                        id="email"
                                        placeholder="What's Your Email Address?"
                                        name="email"
                                        value={loginData.email || ""}
                                        required
                                        onChange={handleInputs}
                                    />
                                    {errors.email && errors.email !== "success" && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Password Field with Toggle */}
                                <div className="form-group position-relative">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control text-light bg-transparent ${errors.password && errors.password !== 'success' ? 'is-invalid' : errors.password === 'success' ? 'is-valid' : ''}`}
                                        id="password"
                                        name="password"
                                        placeholder="What's Your Secret Password?"
                                        value={loginData.password || ""}
                                        onChange={handleInputs}
                                        required
                                    />
                                    {errors.password && errors.password !== "success" && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                        <i className="material-icons mt-1">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </i>
                                    </span>
                                </div>

                                {/* Terms and Conditions Checkbox */}
                                <div className="form-group form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="termsConditions"
                                        onInvalid={(e) => e.target.setCustomValidity('You must agree with our terms and conditions to login.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="termsConditions" style={{ color: '#fff' }}>
                                        I agree to the <a href="#" className="text-primary text-decoration-none">Terms & Conditions</a>
                                    </label>
                                </div>

                                {/* Forgot Password */}
                                <div className="form-group">
                                    <p style={{ color: '#ccc' }}>
                                        Forgot your password?
                                        <a href="#" onClick={() => setForgetPasswordStatus(true)} className="text-primary text-decoration-none ml-1">
                                            Reset it here.
                                        </a>
                                    </p>
                                </div>

                                {/* Register Option for New Users */}
                                <div className="form-group">
                                    <p style={{ color: '#fff' }}>
                                        Don’t have an account?
                                        <a href="#" id="switchToRegister" data-toggle="modal" data-target="#RegistrationModal" data-dismiss="modal" className="text-primary text-decoration-none"> Register now</a>
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
                                <button type="submit" className="btn btn-primary">Login Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <button ref={modalOpenRef} style={{ display: "none" }} data-toggle="modal" data-target="#EmailVerificationModal">Demo BTN</button>
            {forgetPasswordStatus && <EmailVerificationModal modalType={"Forgot Password"} />}
        </>
    );
};

export default LoginModal;
