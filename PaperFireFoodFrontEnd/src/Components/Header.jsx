import { menuItemsList } from '../Script/index';

const Header = () => {
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
                            <a className="nav-link" href={item.link}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Header;
