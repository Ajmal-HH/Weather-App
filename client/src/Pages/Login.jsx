import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import bgImage from '../assets/images/Stormy.jpg';
import { toast } from 'react-toastify'




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({})

  const navigate = useNavigate();

  const signInValidationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._-]+@gmail\.com$/, 'Please enter a valid gmail address (e.g., example@gmail.com).')
      .email('Invalid email format')
      .required('Please enter the email'),
    password: Yup.string()
      .trim()
      .required('Please enter the password')
  });



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await signInValidationSchema.validate({ email, password }, { abortEarly: false })

      axios.post(`http://localhost:5001/login`, { email, password })
        .then((response) => {
          toast.success('Login successfully')
          localStorage.setItem('token', response.data.token);
          navigate('/')
        })
        .catch((err) => {
          console.log(err.response.data.message);
          if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error('An error occurred. Please try again later.');
          }
        })
    } catch (error) {
      const newErrors = {}

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message
      })
      setErrors(newErrors)
    }
  }

  return (

    <div className='min-h-screen w-full bg-cover bg-no-repeat text-black' style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }} >
      <div className='flex flex-col items-center' >
        <div className='glassCard min-h-[340px] w-[400px] rounded-lg  mt-20'>
          <h1 className='text-center font-bold text-2xl mt-4'>SIGNIN</h1>
          <form onSubmit={handleSubmit} className='mt-5'>
            <div className='ml-10'>

              <label htmlFor="email" className=' text-lg'>Email</label>
              <input type="email"
                name='email'
                placeholder='Enter the email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='block w-80 h-8 rounded-lg pl-2'
              />
              {errors.email && <div className='text-red-600'>{errors.email}</div>}

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
                SIGNIN
              </button>
            </div>
          </form>

          <h1 className=' text-sm text-center mt-2'> {'Don\'t have an account?'}</h1>
          <Link to={'/register'} className=' text-md ml-40  hover:text-red-700 cursor-pointer '>SignUp Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
