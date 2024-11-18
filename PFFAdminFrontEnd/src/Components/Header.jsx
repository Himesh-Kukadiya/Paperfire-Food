import { BsJustify } from 'react-icons/bs'
import PropTypes from "prop-types";

const Header = ({ title, OpenSidebar }) => {
    return (
        <header className='header'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSidebar} />
            </div>
            <div className='main-title'>
                <h3>{title}</h3>
            </div>
        </header>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    OpenSidebar: PropTypes.func.isRequired,
}
export default Header