import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { validateEmail, validatePassword } from "../../Script/";

const EmailVerificationModal = ({ email, userData, modalType, name }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [otpStatus, setOtpStatus] = useState(false);
    const [isResendActive, setIsResendActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [passwordData, setPasswordData] = useState(email !== undefined ? {} : { email: "" });
    const [validationErrors, setValidationErrors] = useState({});
    const [invalidOtpError, setInvalidOtpError] = useState(false);

    const emailRef = useRef(email !== undefined ? email : "");
    const timerRef = useRef(null);
    const remainingTimeRef = useRef(10);
    const resendRef = useRef(null);
    const verifyRef = useRef(null);
    const closeModalRef = useRef(null);

    useEffect(() => { console.log(email) }, [])

    useEffect(() => {
        if (otpStatus) {
            handleTimer();
        }
        return () => clearInterval(timerRef.current); // Cleanup timer on unmount
    }, [otpStatus]);

    const handleTimer = () => {
        setIsResendActive(false);
        remainingTimeRef.current = 10;
        if (resendRef.current) {
            resendRef.current.innerText = `Resend in ${remainingTimeRef.current}s`;
        }

        timerRef.current = setInterval(() => {
            remainingTimeRef.current -= 1;
            if (resendRef.current) {
                resendRef.current.innerText = `Resend in ${remainingTimeRef.current}s`;
            }

            if (remainingTimeRef.current <= 0) {
                clearInterval(timerRef.current);
                setIsResendActive(true);
                if (resendRef.current) {
                    resendRef.current.innerText = "Resend OTP";
                }
            }
        }, 1000);
    };

    const handleKeyDown = (element, event) => {
        if (event.key === "Backspace" && !element.value && element.previousSibling) {
            element.previousSibling.focus();
        }
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && element.nextSibling) {
            return element.nextSibling.focus();
        }
        if (element.value && !element.nextSibling) {
            verifyRef.current.focus();
        }
    };

    const handleSendOtp = () => {
        const data = { email: email !== undefined ? email : passwordData.email, name: name || "User" };
        axios
            .post("http://localhost:7575/api/sendOTP", data)
            .then((response) => {
                console.log(response.data);
                setOtpStatus(true);
                handleTimer();
            })
            .catch((error) => console.error(`Error while sending OTP: ${error}`));
    };

    const handleResendOtp = () => {
        setOtp(new Array(6).fill(""));
        handleSendOtp();
        handleTimer();
    };

    const handleVerifyOtp = () => {
        const data = {
            email: email !== undefined ? email : passwordData.email,
            otp: otp.join(""),
            userData: userData,
        };
        axios
            .post("http://localhost:7575/api/verifyOtp", data)
            .then((response) => {
                console.log(response.data);
                setOtpStatus(true);

                if (modalType === "Email Verification") {
                    localStorage.setItem("userDataPFF", JSON.stringify(response.data.data));
                    window.location = `/${response.data.data._id}`;
                } else {
                    // Proceed to password change step if this is for password reset
                    setStep(2);
                }
            })
            .catch((error) => {
                console.error(`Error while sending OTP: ${error}`);
                setInvalidOtpError(true);
            });
    };

    const handleChangePassword = () => {
        const data = { ...passwordData, email: email !== undefined ? email : passwordData.email };
        axios.post("http://localhost:7575/api/changePassword", data)
            .then(() => {
                closeModalRef.current.click();
            })
            .catch((error) => {
                console.error(`Error while changing password: ${error}`);
            });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case "password":
                setValidationErrors({
                    ...validationErrors,
                    password: validatePassword(value)
                        ? "success"
                        : "Password must contain an uppercase, lowercase, number, and special character",
                });
                break;
            case "rePassword":
                setValidationErrors({
                    ...validationErrors,
                    rePassword: passwordData.password === value ? "success" : "Passwords do not match",
                });
                break;
            default:
                break;
        }
        setPasswordData({ ...passwordData, [name]: value });
    };

    return (
        <div
            className="modal fade"
            id="EmailVerificationModal"
            tabIndex="-1"
            aria-labelledby="EmailVerificationModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="EmailVerificationModalLabel">
                            {modalType === "Email Verification" ? "Email Verification" : (step === 1 ? "Email Verification" : "Change Password")}
                        </h5>
                        <button type="button" ref={closeModalRef} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    {step === 1 ? (
                        <>
                            <div className="modal-body">
                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control text-light bg-transparent ${validationErrors.email && validationErrors.email !== "success"
                                                ? "is-invalid"
                                                : validationErrors.email === "success"
                                                    ? "is-valid"
                                                    : ""
                                            }`}
                                        id="email"
                                        placeholder="What's Your Email Address?"
                                        name="email"
                                        value={email !== undefined ? email : passwordData.email}
                                        onChange={(e) => {
                                            setValidationErrors({
                                                ...validationErrors,
                                                email: !validateEmail(e.target.value) ? "success" : "Invalid Email Address",
                                            });
                                            setPasswordData({ ...passwordData, email: e.target.value });
                                        }}
                                        readOnly={emailRef.current}
                                    />
                                </div>

                                {/* OTP Field */}
                                {otpStatus && (
                                    <div className="form-group">
                                        <label htmlFor="otp">Verification Code</label>
                                        <div id="otp" style={{ display: "flex", justifyContent: "space-evenly" }}>
                                            {otp.map((data, index) => (
                                                <input
                                                    type="text"
                                                    name="otp"
                                                    className="align-center bg-transparent"
                                                    maxLength="1"
                                                    key={index}
                                                    value={otp[index]}
                                                    onChange={(e) => handleChange(e.target, index)}
                                                    onKeyDown={(e) => handleKeyDown(e.target, e)}
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        textAlign: "center",
                                                        fontSize: "20px",
                                                        border: "1px solid white",
                                                        borderRadius: "5px",
                                                        color: "white",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {otpStatus && (
                                    <div className="form-group d-flex justify-content-end pr-1">
                                        {!isResendActive ? (
                                            <span className="text-warning" ref={resendRef}>
                                                Resend in {remainingTimeRef.current}s
                                            </span>
                                        ) : (
                                            <button className="btn btn-link" onClick={handleResendOtp}>
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Closeable alert for invalid OTP */}
                                {invalidOtpError && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Invalid OTP. Please try again.
                                        <button type="button" className="close" onClick={() => setInvalidOtpError(false)} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-light w-100" onClick={otpStatus ? handleVerifyOtp : handleSendOtp} ref={verifyRef}>
                                    {otpStatus ? "Verify OTP" : "Send OTP"}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Step 2: Change Password
                        <div className="modal-body">
                            {/* New Password */}
                            <div className="form-group position-relative">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control text-light bg-transparent ${validationErrors.password && validationErrors.password !== 'success' ? 'is-invalid' : validationErrors.password === 'success' ? 'is-valid' : ''}`}
                                        id="password"
                                        name="password"
                                        placeholder="What's Your Secret Password?"
                                        value={passwordData.password || ""}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    {validationErrors.password && validationErrors.password !== 'success' && <small className="text-danger">{validationErrors.password}</small>}
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className="material-icons mt-1">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </i>
                                    </span>
                                </div>

                            {/* Confirm Password */}
                            <div className="form-group position-relative">
                                    <label htmlFor="rePassword">Re-enter Password</label>
                                    <input
                                        type={showRePassword ? "text" : "password"}
                                        className={`form-control text-light bg-transparent ${validationErrors.rePassword && validationErrors.rePassword !== 'success' ? 'is-invalid' : validationErrors.rePassword === 'success' ? 'is-valid' : ''}`}
                                        id="rePassword"
                                        name="rePassword"
                                        placeholder="Re-enter Your Secret Password"
                                        value={passwordData.rePassword || ""}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    {validationErrors.rePassword && validationErrors.rePassword !== 'success' && <small className="text-danger">{validationErrors.rePassword}</small>}
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowRePassword(!showRePassword)}
                                    >
                                        <i className="material-icons mt-1">
                                            {showRePassword ? "visibility_off" : "visibility"}
                                        </i>
                                    </span>
                                </div>
                            {/* <div className="form-group">
                                <label htmlFor="rePassword">Confirm Password</label>
                                <input
                                    type={showRePassword ? "text" : "password"}
                                    className={`form-control text-light bg-transparent ${validationErrors.rePassword && validationErrors.rePassword !== "success"
                                            ? "is-invalid"
                                            : validationErrors.rePassword === "success"
                                                ? "is-valid"
                                                : ""
                                        }`}
                                    id="rePassword"
                                    placeholder="Re-enter Password"
                                    name="rePassword"
                                    onChange={handlePasswordChange}
                                />
                                {validationErrors.rePassword && (
                                        <div className="invalid-feedback">{validationErrors.rePassword}</div>
                                    )}
                                    <span className="eye-icon" onClick={() => setShowRePassword(!showRePassword)}>
                                        <i className="material-icons mt-1">
                                            {showRePassword ? "visibility_off" : "visibility"}
                                        </i>
                                    </span>
                            </div> */}
                        </div>
                    )}

                    <div className="modal-footer">
                        {step === 2 && (
                            <button
                                type="button"
                                className="btn btn-outline-light w-100"
                                onClick={handleChangePassword}
                                ref={verifyRef}
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

EmailVerificationModal.propTypes = {
    email: PropTypes.string,
    modalType: PropTypes.oneOf(["Email Verification", "Forgot Password"]),
    userData: PropTypes.object,
    name: PropTypes.string,
};

export default EmailVerificationModal;
