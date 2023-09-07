import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import {axiosInstance} from '../axios'
import Layout from "../components/Layout"

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user') && localStorage.getItem('user') != null) {
            navigate("/dashboard");
        }
    }, [])

    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('/auth/login', {
            username: email,
            password: password
        })
            .then(function (response) {
                console.log("response",response)
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Login successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/dashboard");
                setIsSaving(false);
                setEmail('')
                setPassword('')
            })
            .catch(function (error) {
                console.log("error",error)
                Swal.fire({
                    icon: 'error',
                    title: error.message,
                    showConfirmButton: false,
                    timer: 1500,
                })
                setIsSaving(false)
            });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                                <form>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={email}
                                            onChange={(event) => { setEmail(event.target.value) }}
                                            type="email"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="name@example.com"
                                        />
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={password}
                                            onChange={(event) => { setPassword(event.target.value) }}
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            placeholder="Password"
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            disabled={isSaving}
                                            onClick={handleSave}
                                            type="submit"
                                            className="btn btn-primary btn-login text-uppercase fw-bold" >
                                            Sign in
                                        </button>
                                    </div>
                                    <hr className="my-4"></hr>

                                    <div className="d-grid">
                                        <Link className="btn btn-outline-primary btn-login text-uppercase fw-bold" to="/signup">Create new account </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Login;