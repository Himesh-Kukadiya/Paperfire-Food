import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ShowFullImageModal from './ShowFullImage.Modal';
import { validateMobile } from '../../Script';
import EmailVerificationModal from './EmailVerification.Modal';

const ProfileModal = () => {
    const { userId } = useParams();
    const userData = JSON.parse(localStorage.getItem("userDataPFF")) || {};

    const fileInputRef = useRef(null);

    const [forgetPasswordStatus, setForgetPasswordStatus] = useState(false);
    const [editedData, setEditedData] = useState({ ...userData });
    const [errors, setErrors] = useState({ name: false, email: false, mobile: false, restaurant: false, rAddress: false });
    const [isEditing, setIsEditing] = useState({ name: false, email: false, mobile: false, restaurant: false, rAddress: false });
    const modalOpenRef = useRef(null);

    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profileImage", file);
            formData.append("userId", userId);

            axios.patch("http://localhost:7575/uploads/profileimage/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
                .then((response) => {
                    const updatedUserData = { ...userData, imageURL: response.data.imageURL };
                    setEditedData(updatedUserData);
                    localStorage.setItem("userDataPFF", JSON.stringify(updatedUserData));
                })
                .catch((error) => console.error("Error while uploading Profile Image:", error));
        }
    };

    // Function to handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));

        switch (name) {
            case "name":
                value.length <= 2 ? setErrors({ ...errors, name: true }) : setErrors({ ...errors, name: false });
                break;
            case "mobile":
                validateMobile(value) ? setErrors({ ...errors, mobile: true }) : setErrors({ ...errors, mobile: false });
                break;
            case 'restaurant':
                value.length <= 2 ? setErrors({ ...errors, restaurant: true }) : setErrors({ ...errors, restaurant: false });
                break;
            case 'rAddress':
                value.length <= 5 ? setErrors({ ...errors, rAddress: true }) : setErrors({ ...errors, rAddress: false });
                break;
            default:
                break;
        }
    };

    useEffect(() => { modalOpenRef.current.click(); }, [forgetPasswordStatus])

    // Function to save changes
    const handleSaveChanges = () => {
        axios.post("http://localhost:7575/api/updateProfile", editedData)
            .then((res) => {
                localStorage.setItem('userDataPFF', JSON.stringify(res.data.userData));
                setIsEditing({ name: false, email: false, mobile: false, restaurant: false, rAddress: false });
            })
            .catch((err) => console.error("Error updating profile:", err));
    };

    return (
        <>
            <div className="modal fade" id="ProfileModal" tabIndex="-1" aria-labelledby="ProfileModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content profile-modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title align-middle" id="ProfileModalLabel">My Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            {/* User Image */}
                            <div className="mb-4 position-relative">
                                <img
                                    className="rounded-circle user-image"
                                    src={`http://localhost:7575/Images/Users/${userData.imageURL}`}
                                    alt="User"
                                    data-toggle="modal"
                                    data-target="#FullImageModal"
                                />
                                {/* Edit Icon */}
                                <span className="edit-image-icon" onClick={() => fileInputRef.current.click()}>
                                    <i className="material-icons">edit</i> Edit
                                </span>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className='d-none'
                                    accept="image/*"
                                />
                                <hr />
                            </div>

                            <div className="profile-details">
                                {
                                    ["name", "email", "mobile", "restaurant", "rAddress"].map((profileData) => (
                                        <div className="detail-item mb-3" key={profileData}>
                                            <h6 className="detail-title">{profileData.charAt(0).toUpperCase() + profileData.slice(1)}</h6>
                                            <p className="detail-text">
                                                {isEditing[profileData] ? (
                                                    <>
                                                        <input
                                                            className={`form-control text-light bg-transparent ${errors[profileData] ? 'is-invalid' :  'is-valid' }`}
                                                            type={profileData === "mobile" ? "number" : "text"}
                                                            name={profileData}
                                                            value={editedData[profileData] || ''}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                        <span className="update-icon" onClick={handleSaveChanges}>
                                                            <i className="material-icons">edit</i> Update
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        {userData[profileData] || 'N/A'}
                                                        {profileData !== "email" && (
                                                            <span className="edit-icon" onClick={() => setIsEditing({ ...isEditing, [profileData]: true })}>
                                                                <i className="material-icons">edit</i> Edit
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            <hr />
                                        </div>
                                    ))
                                }
                                {/* Logout and Forget Password */}
                                <div className="detail-item mb-3">
                                    <h6 className="detail-title">Actions</h6>
                                    <p className="detail-buttons">
                                        <button className="btn btn-dark btn-sm w-50" onClick={() => {
                                            window.location.href = `/${userId}/orderHistory`;
                                        }}>My Orders</button>
                                        <button className="btn btn-dark btn-sm w-50" onClick={() => {
                                            localStorage.removeItem("userDataPFF");
                                            localStorage.removeItem("cartPFF");
                                            window.location.href = "/";
                                        }}>Logout</button>
                                        <button className="btn btn-link btn-dark btn-sm w-50" onClick={() => setForgetPasswordStatus(true)} >Forget Password?</button>
                                    </p>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button ref={modalOpenRef} style={{display: "none"}} data-toggle="modal" data-target="#EmailVerificationModal">Demo BTN</button>
            <ShowFullImageModal imageURL={`http://localhost:7575/Images/Users/${userData.imageURL}`} />
            {forgetPasswordStatus && <EmailVerificationModal email={userData.email} modalType={"Forgot Password"} name={userData.name} />}
        </>
    );
};

export default ProfileModal;
