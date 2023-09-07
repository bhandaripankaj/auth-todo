import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import {axiosInstance} from '../axios'

import Layout from "../components/Layout"

function ProjectList() {
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList()
    }, [])

    const fetchProjectList = () => {
        axiosInstance.get('https://dummyjson.com/todos?skip=0&&limit=10')
            .then(function (response) {
                console.log("response",response)
                setProjectList(response.data.todos);
                setTotal(response.data.total)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`/api/projects/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Project deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProjectList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Project Manager</h2>
                <div className="card">
                    <div className="card-header">
                        <Link className="btn btn-outline-primary" to="/create">Create New Project </Link>
                        <button onClick={() => Logout()} className="btn btn-outline-danger float-end"> Logout </button>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Project No</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th width="240px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectList.map((project, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{project.id}</td>
                                            <td>{project.todo}</td>
                                            <td style={{color:project.completed?"green":"red"}} >{project.completed?"Done":"Fail"}</td>
                                            <td>
                                                <Link
                                                    to={`/show/${project.id}`}
                                                    className="btn btn-outline-info mx-1">
                                                    Show
                                                </Link>
                                                <Link
                                                    className="btn btn-outline-success mx-1"
                                                    to={`/edit/${project.id}`}>
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="btn btn-outline-danger mx-1">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
           <ul className="pagination justify-content-center">
        {Array.from({ length: Math.ceil(total / itemsPerPage) }).map((_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
                <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </button>
            </li>
        ))}
    </ul>
    </div>
    </div>
        </Layout>
    );
}

export default ProjectList;