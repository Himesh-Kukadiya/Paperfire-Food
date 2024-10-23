import PropTypes from "prop-types"

const ShowFullImageModal = ({imageURL}) => {
    return (
        <>
            <div className="modal fade" id="FullImageModal" tabIndex="-1" aria-labelledby="FullImageModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content profile-modal-content">
                    <div className="modal-body text-center">
                        <img src={imageURL} alt="userImage" style={{maxHeight: 400, maxWidth: 400, borderRadius: 5}}  />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

ShowFullImageModal.propTypes = {
    imageURL: PropTypes.string.isRequired
}

export default ShowFullImageModal