import {home} from '../Script/assets.js';

const Home = () => {
    return (
        <header id="home" className="header">
            <img src={home} alt="Dark Background Image" className="header-image" />
                <div className="overlay"></div>
                <div className="header-content">
                    <h1 className="display-4 text-light animated fadeInDown">Restaurant Equipment Rental</h1>
                    <p className="lead text-light animated fadeInUp">High-quality equipment for your restaurant needs</p>
                    <a href="#services" className="btn btn-primary btn-lg animated fadeIn">Learn More</a>
                </div>
        </header>
    )
}

export default Home