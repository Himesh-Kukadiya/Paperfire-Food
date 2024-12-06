import LoginPageCss from "./CSS/LoginPage.module.css"
import { useState } from 'react'
import axios from "axios";
import { useNavigate} from 'react-router-dom' 

const Login = () => {
    var navigate = useNavigate();
    const [loginData, setloginData] = useState({
        "email" : "",
        "password":""
    })
    const [errors, seterrors] = useState(null);
    const [errorStatus, seterrorStatus] = useState(false);
    
    const handleInputs = (e) => {
        const keyName = e.target.name;
        const value = e.target.value;
        setloginData({
            ...loginData,
            [keyName] : value
        })
    }

    const loginRequest = (e) => {
        e.preventDefault();

        axios
        .post("http://localhost:7575/api/admin/adminLogin", loginData)
        .then((response) => {
            seterrors("Login successful");
            seterrorStatus(false)
            localStorage.setItem("PFFAdminData", JSON.stringify(response.data.data))
            setTimeout(() => {
                navigate(`/dashboard/${response.data.data._id}`);
            }, 200);
        })
        .catch((error) => {
            seterrorStatus(true)
            seterrors(error.response.data.message);
        });
    }

    // check use loged in or not...
    const adminData = JSON.parse(localStorage.getItem("PFFAdminData"));
    if( adminData != null) {
        setTimeout(() => {
            navigate(`/dashboard/${adminData._id}`);
        }, 100);
    }
    return (
        <div className={LoginPageCss.LoginBody}>
            <main className='Login'>
                <header>
                    <h4 className="text-dark">Login</h4>
                </header>
                <form onSubmit={loginRequest}>
                {/* <form > */}
                    {/* Email */}
                    <div className={LoginPageCss.form_wrapper}>
                        <input className='input' id="input" name="email" type="text" onChange={handleInputs} required />
                            <label htmlFor="input">Email</label>
                            <i className="material-icons">email</i>
                    </div>
                    {/* Password */}
                    <div className={LoginPageCss.form_wrapper}>
                        <input className='input' id="password" name="password" type="password" onChange={handleInputs} required />
                            <label htmlFor="password">Password</label>
                            <i className="material-icons">lock</i>
                    </div>
                    {/* Error Message */}
                    <div className={LoginPageCss.form_wrapper}>
                        <label className={errorStatus ? LoginPageCss.errors : LoginPageCss.success}>{errors} </label>
                    </div>
                    <div className={LoginPageCss.remember_box}>
                        <div className={LoginPageCss.remember}>
                            <input type="checkbox" id="remember" />
                                <span htmlFor="remember">Remember me</span>
                        </div>
                        <a href="#">Forgot Password ?</a>
                    </div>
                    <button type='submit'>Login</button>
                </form>
            </main>
        </div>
    )
}

export default Login