const menuItemsList = [
    {
        id: 'm1',
        title: "Home",
        link: "#home"
    },
    {
        id: 'm2',
        title: "About",
        link: "#about"
    },
    {
        id: 'm3',
        title: "Services",
        link: "#services"
    },
    {
        id: 'm4',
        title: "Products",
        link: "#products"
    },
    {
        id: 'm5',
        title: "Gallery",
        link: "#gallery"
    },
    {
        id: 'm6',
        title: "Testimonials",
        link: "#testimonials"
    },
    {
        id: 'm7',
        title: "Contact",
        link: "#contact"
    },
];

const validateEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;
    else return false;
}

const validateMobile = (mobile) => {
    if (!/^[6-9]\d{9}$/.test(mobile)) return true;
    else return false;
}

const validateZip = (zip) => {
    if(!/^\d{6}$/.test(zip)) return true;
    else return false;
}

const validatePassword = (password) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return true; 
    else return false;
}
export {
    menuItemsList,
    validateEmail,
    validateMobile,
    validateZip,
    validatePassword
}