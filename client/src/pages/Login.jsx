import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'

function Login() {
  const [formData, setFormData] = useState({
  email: '',
  password: ''
})

const [error, setError] = useState('')

  const { loading } = useSelector((state) => state.auth)

  const navigate = useNavigate()
const dispatch = useDispatch()

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  try {
    await dispatch(loginUser(formData)).unwrap()
    navigate('/dashboard')
  } catch (err) {
    setError(err || 'Login failed')
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
  FinTrack
</h1>

<p className="text-center text-gray-500 mb-6">
  Create your account
</p>

        {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
    {error}
  </div>
)}

        <form
  onSubmit={handleSubmit}
  className="space-y-4"
>   
          <div className="mb-4">
           <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter your email"
    required
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
  />
</div>
          </div>

          <div className="mb-6">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>

  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
    required
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
  />
</div>
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
>
  {loading ? 'Logging in...' : 'Login'}
</button>
        </form>

        <div className="text-center mt-4">
  <p className="text-gray-600">
    Don't have an account?{' '}
    <Link
      to="/signup"
      className="text-blue-600 hover:underline font-semibold"
    >
      Sign Up
    </Link>
  </p>
</div>
      </div>
    </div>
  )
}

export default Login