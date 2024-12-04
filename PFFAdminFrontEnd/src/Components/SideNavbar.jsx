import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsMenuButtonWideFill, BsFillPersonFill, BsBoxArrowRight, } from 'react-icons/bs';
import PropTypes from 'prop-types';

function SideNavbar({ openSidebarToggle, OpenSidebar, newOrderCount }) {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <BsFillGrid3X3GapFill className="icon" />{" "}
                    <span style={{ color: "red" }}>PF</span>F{" "}
                    <span style={{ color: "red" }}>Ad</span>min
                </div>
                <span className="icon close_icon" onClick={OpenSidebar}>
                    X
                </span>
            </div>

            <div className="menu-box">
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <a href="/">
                            <BsGrid1X2Fill className="icon" /> Dashboard
                        </a>
                    </li>

                    <li className="sidebar-list-item">
                        <a href="/Products">
                            <BsFillArchiveFill className="icon" /> Products
                        </a>
                    </li>

                    <li className="sidebar-list-item position-relative">
                        <a href="/Orders&Rents">
                            <BsFillGrid3X3GapFill className="icon" /> Orders & Rentals
                            {newOrderCount > 0 && (
                                <span className="notification-badge">{newOrderCount}</span>
                            )}
                        </a>
                    </li>

                    <li className="sidebar-list-item">
                        <a href="/users">
                            <BsPeopleFill className="icon" /> Users
                        </a>
                    </li>

                    <li className="sidebar-list-item">
                        <a href="#">
                            <BsMenuButtonWideFill className="icon" /> Reports
                        </a>
                    </li>
                </ul>

                <ul className="sidebar-footer">
                    <li className="sidebar-list-item">
                        <a href="#">
                            <BsFillPersonFill className="icon" /> Profile
                        </a>
                    </li>
                    <li className="sidebar-list-item">
                        <a href="#">
                            <BsBoxArrowRight className="icon" /> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

SideNavbar.propTypes = {
    openSidebarToggle: PropTypes.bool.isRequired,
    OpenSidebar: PropTypes.func.isRequired,
    newOrderCount: PropTypes.number.isRequired, 
};

export default SideNavbar;
