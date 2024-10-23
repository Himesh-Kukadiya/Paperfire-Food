import { menuItemsList } from '../Script/index';

const Header = () => {
    const userData = JSON.parse(localStorage.getItem('userDataPFF'))
    const scrollToTop = (sectionName) => {
        const element = document.getElementById(sectionName);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
            <a className="navbar-brand" href="#">Paperfire Food</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    {menuItemsList.map(item => (
                        <li className="nav-item" key={item.id}>
                            <a className="nav-link" onClick={scrollToTop} href={userData ? `/${userData._id}${item.link}` : item.link}>{item.title}</a>
                        </li>
                    ))}
                    <li className='nav-item'>
                        {userData
                            ? userData.imageURL === "default.png" ? (
                                    <span
                                        className='rounded-circle font-bold mt-2 bg-white text-dark d-inline-flex align-items-center justify-content-center'
                                        style={{ width: '30px', height: '30px', fontSize: "25px", cursor: 'pointer'}}
                                        data-toggle="modal" data-target="#ProfileModal"
                                    >
                                        {userData.name[0].toUpperCase()}
                                    </span>
                                ) : (
                                    <img
                                        className='nav-link d-inline rounded-circle shadow-danger'
                                        src={`http://localhost:7575/Images/Users/${userData.imageURL}`}
                                        style={{ maxHeight: '45px', maxWidth: '45px', objectFit: 'cover', cursor: 'pointer' }}
                                        data-toggle="modal" data-target="#ProfileModal"
                                    />
                                )

                            : (<>
                                <a href="#" className='btn btn-danger px-4 mr-2' data-toggle="modal" data-target="#LoginModal">Login</a>
                                <a href="#" className='btn btn-danger px-4' data-toggle="modal" data-target="#RegistrationModal">Register</a>
                            </>)}

                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
