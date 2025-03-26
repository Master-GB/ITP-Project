import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';



function Login() {


    const history = useNavigate();
    const[user,setUser]=useState({
        email:'',
        password:'',
    });

    const handleInputChange=(e)=>{
        const{name,value}=e.target;
        setUser((prevUser)=>({
            ...prevUser,
            [name]:value
        }));
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response = await sendRequest();
            if(response.status==="ok"){
                alert("Login Success");
                history('/userdetails');
            }else{
                alert("Login Failed");
            }
          
        }catch(error){
            console.error('Error:',error);
        }
    };
    const sendRequest=async()=>{
        return await axios.post('http://localhost:8090/login',{
            email:user.email,
            password:user.password,
        }).then(res=>res.data);
    }

    

  return (
    <div className='login-body'>
        <div className='login-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
               <div className='login-input-field'>
                <label>Email:</label>
                <input className='login-input-box'
                type="email" 
                name="email" 
                value={user.email} 
                onChange={handleInputChange} 
                placeholder='Enter your email'
                required />

               </div>
                <div className='login-input-field'>
                 <label>Password:</label>
                 <input className='login-input-box'
                 type="password" 
                 name="password" 
                 value={user.password} 
                 onChange={handleInputChange} 
                 placeholder='Enter your password'
                 required />
                </div>
                <button className='login-button' type="submit">Login</button>
            </form>
        </div>
  </div>
  );
}

export default Login;
