import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import bgImage from '../assets/images/Stormy.jpg';
import '../index.css'
import {toast} from 'react-toastify'

const Register = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({})

  const navigate = useNavigate();

  const validationSchema =  Yup.object({
    name : Yup.string()
              .matches(/^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/, 'Please enter a name containing only alphabetic characters.')
              .trim()
              .required('Name is required')
              .min(3,"Name must be atleast 3 characters"),
    email : Yup.string()
               .matches(/^[a-zA-Z0-9._-]+@gmail\.com$/,'Please enter a valid gmail address (e.g., example@gmail.com).')
               .email('Invalid email formate')
               .required('Email is required'),
    mobile : Yup.string()
                .matches(/^\d{10}$/,"mobile number must be 10 digits")
                .required('Mobile number is required'),
    password : Yup.string()
                  .trim()
                  .required('Password is required')
                  .min(6,'Password must be atleast 6 characters')
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await validationSchema.validate({name,email,mobile,password}, {abortEarly : false})

     axios.post(`http://localhost:5001/register`, { name, email, password, mobile })
     .then(() => {
       navigate('/login');
     }).catch((err) => {
       if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
        setErrors(err.response.data.message)
      } else {
         toast.error('An error occurred. Please try again later.');
       }
     });
    } catch (error) {
      if (error.inner) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error(error); // Log the error for debugging purposes
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    
    <div className='min-h-screen bg-cover text-black' style={{ backgroundImage: `url(${bgImage})` }} >
      <div className='flex flex-col items-center' >
        <div className='glassCard min-h-[400px] w-[400px] rounded-lg  mt-20'>
          <h1 className='text-center font-bold text-2xl mt-4'>SIGNUP</h1>
          <form onSubmit={handleSubmit} className='mt-5'>
            <div className='ml-10'>
            <label htmlFor="name" className=' text-lg'>Name</label>
              <input type="text"
                placeholder='Enter the name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='block w-80 h-8 rounded-lg pl-2'
              />
              {errors.name && <div className='text-red-600'>{errors.name}</div>}
              <label htmlFor="email" className=' text-lg'>Email</label>
              <input type="email"
                name='email'
                placeholder='Enter the email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='block w-80 h-8 rounded-lg pl-2'
              />
              {errors.email && <div className='text-red-600'>{errors.email}</div>}
              <label htmlFor="mobile" className=' text-lg'>Mobile</label>
              <input type="number"
                name='number'
                placeholder='Enter Mobile Number'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className='block w-80 h-8 rounded-lg pl-2'
              />
              {errors.mobile && <div className='text-red-600'>{errors.mobile}</div>}

              <label htmlFor="password" className=' text-lg'>Password</label>
              <input type="password"
                name='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='block w-80 h-8 rounded-lg pl-2'
              />
              {errors.password && <div className='text-red-600'>{errors.password}</div>}

            <button type='submit' className="w-80 h-8 flex items-center justify-center  mt-5  bg-amber-500 text-black  font-semibold  rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75">
              SIGNUP
            </button>
            </div>
           
            
          </form>
    
          <h1 className=' text-sm text-center mt-2'> {'Already have an account?'}</h1>
          <Link to={'/login'} className=' text-md ml-40  hover:text-red-700 cursor-pointer '>SignIn Here</Link>
        </div>



      </div>
    </div>
  
  );
};

export default Register;
