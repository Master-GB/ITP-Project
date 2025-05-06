import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaIdBadge, FaUser, FaEnvelope, FaUserTag, FaPhone, FaMapMarkerAlt, FaKey } from 'react-icons/fa';
import './User.css';


function User(props) {
    const { _id, name, email, role, contactNumber, address, password } = props.user;
  
    const history = useNavigate();

   
    const deleteHandler = async () => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to recover this user!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel it!',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary'
            },
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8090/users/${_id}`);
                
                // Show success message
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'User has been deleted successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                window.location.reload();
                history('/userdetails');
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete the user.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error('Error deleting user:', error);
            }
        }
    }

    return (
        <div className="user-card">
            <p className="user-info"><FaIdBadge className="user-info-icon" /> <strong>ID:</strong> {_id}</p>
            <p className="user-info"><FaUser className="user-info-icon" /> <strong>Name:</strong> {name}</p>
            <p className="user-info"><FaEnvelope className="user-info-icon" /> <strong>Email:</strong> {email}</p>
            <p className="user-info"><FaUserTag className="user-info-icon" /> <strong>Role:</strong> {role}</p>
            <p className="user-info"><FaPhone className="user-info-icon" /> <strong>Contact:</strong> {contactNumber}</p>
            <p className="user-info"><FaMapMarkerAlt className="user-info-icon" /> <strong>Address:</strong> {address}</p>
            <p className="user-info"><FaKey className="user-info-icon" /> <strong>Password:</strong> {password}</p>

            <div className="user-actions">
                <Link to={`/al/userdetails/${_id}`} className="update-link">Update</Link>
                <button onClick={deleteHandler} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default User;