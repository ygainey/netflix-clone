import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    console.log(email, password)
  }

  return (
    <div className='h-screen w-full hero-bg'>
            <header className='max-w-6xl mx-auto flex justify-between items-center p-4'>
                <Link to={'/'}>
                    <img src='netflix-logo.png' alt="Netflix Logo" className="w-52" />
                </Link>
            </header>

            <div className='flex justify-center items-center mt-20 mx-3'>
                <div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'>
                    <h1 className='text-2xl text-center text-white font-bold mb-4'>
                        Log In
                    </h1>

                    <form className='space-y-4' onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor='email'
                                className='text-sm font-medium text-gray-300 block'>
                                Email
                            </label>
                            <input
                                type='email'
                                className='w-full px-3 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
                                placeholder='you@example.com'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='password'
                                className='text-sm font-medium text-gray-300 block'>
                                Password
                            </label>
                            <input
                                type='password'
                                className='w-full px-3 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
                                placeholder='********'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className='w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700'>
                            Login
                        </button>
                        <div className='text-center text-gray-400'>
                            Don't have an account?{' '}
                            <Link to={"/signup"} className='text-red-500 hover:underline'>
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default LoginPage