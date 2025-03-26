import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import "./updateUser.css"


function UpdateUser() {

    const[inputs,setInputs]=useState({});
    const history = useNavigate();
    // const {id} = useParams().id;
    const {id} = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            await axios.get(`http://localhost:8090/users/${id}`).then((res) => res.data)
            .then((data)=>setInputs(data.user));
               
        };
        fetchHandler();
    }, [id]);

    const sendRequest =async()=>{
        await axios.put(`http://localhost:8090/users/${id}`,{
            name: String(inputs.name),
            email: String(inputs.email),
            password: String(inputs.password),
            role: String(inputs.role),
            contactNumber: Number(inputs.contactNumber),
            address: String(inputs.address),
        }).then(res => res.data);
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
  
      const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(()=>
        history('/userdetails'));
        
    };


  return (
    <div className="update-form-container">
      <div className="form-header">Update User</div>
      <form onSubmit={handleSubmit} className="update-form">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              className="form-input"
              required
          />

          <label htmlFor="email" className="form-label">Email:</label>
          <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="form-input"
              required
          />

          <label htmlFor="password" className="form-label">Password:</label>
          <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              className="form-input"
              required
          />

          <label htmlFor="role" className="form-label">Role:</label>
          <select
              name="role"
              value={inputs.role}
              onChange={handleChange}
              className="form-input"
              required
          >
              <option value="">Select Role</option>
              <option value="Donor">Donor</option>
              <option value="Recipient">Recipient</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
          </select>

          <label htmlFor="contactNumber" className="form-label">Contact Number:</label>
          <input
              type="number"
              name="contactNumber"
              value={inputs.contactNumber}
              onChange={handleChange}
              className="form-input"
              required
          />

          <label htmlFor="address" className="form-label">Address:</label>
          <textarea
              name="address"
              value={inputs.address}
              onChange={handleChange}
              className="form-input"
              required
          ></textarea>

          <button type="submit" className="submit-button">Submit</button>
      </form>
  </div>
  );
}

export default UpdateUser;
