import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserComponent from '../User/User';
import Navigationbar from '../unavbar/Navigationbar';
import './Users.css'; // Import the CSS file for styling

const URL = 'http://localhost:8090/users';

const fetchHandler = async () => {
    try {
        const res = await axios.get(URL);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

function Users() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        fetchHandler().then((data) => setUsers(data.users));
    }, []);

    const handleSearch = () => {
        fetchHandler().then((data) => {
            const filteredUsers = data.users.filter((user) =>
                Object.values(user).some((field) =>
                    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setUsers(filteredUsers);
            setNoResults(filteredUsers.length === 0);
        });
    };

    return (
        <div className="user-search-container">
            <Navigationbar />
            <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="user-search"
                type="text"
                name="search"
                placeholder="Search Users Details"
            />
            <button onClick={handleSearch} className="user-search-button">Search</button>
            {noResults ? (
                <div>
                    <p>No Users Found</p>
                </div>
            ) : (
                <table className="user-table">
                    <tbody className='tbody-users'>
                        {users && users.map((user, i) => (
                            <UserComponent key={i} user={user} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Users;