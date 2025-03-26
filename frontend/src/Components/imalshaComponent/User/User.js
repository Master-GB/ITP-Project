import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './User.css';


function User(props) {
    const { _id, name, email, role, contactNumber, address, password } = props.user;
  
    const history = useNavigate();

   
    const deleteHandler = async () => {
        try {
            await axios.delete(`http://localhost:8090/users/${_id}`).then((res) => res.data);
            window.location.reload();
            history('/userdetails');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return (
        <div className="user-card">
            <p className="user-info"><strong>ID:</strong> {_id}</p>
            <p className="user-info"><strong>Name:</strong> {name}</p>
            <p className="user-info"><strong>Email:</strong> {email}</p>
            <p className="user-info"><strong>Role:</strong> {role}</p>
            <p className="user-info"><strong>Contact:</strong> {contactNumber}</p>
            <p className="user-info"><strong>Address:</strong> {address}</p>
            <p className="user-info"><strong>Password:</strong> {password}</p>

            <div className="user-actions">
                <Link to={`/userdetails/${_id}`} className="update-link">Update</Link>
                <button onClick={deleteHandler} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default User;