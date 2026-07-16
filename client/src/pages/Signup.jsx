import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../redux/slices/authSlice'

function Signup() {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
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

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match')
    return
  }

  try {
    await dispatch(
      signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    ).unwrap()

    navigate('/dashboard')
  } catch (err) {
    setError(err || 'Signup failed')
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
  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
  Full Name
</label>

<input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
  required
  className="w-full border rounded-lg px-4 py-3"
/>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
  Email
</label>

<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  required
  className="w-full border rounded-lg px-4 py-3"
/>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
  Password
</label>

<input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter password"
  required
  className="w-full border rounded-lg px-4 py-3"
/>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
  Confirm Password
</label>

<input
  type="password"
  name="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm password"
  required
  className="w-full border rounded-lg px-4 py-3"
/>
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
>
  {loading ? 'Creating account...' : 'Sign Up'}
</button>
        </form>

        <div className="text-center mt-6">
  <p className="text-gray-600">
    Already have an account?{' '}
    <Link
      to="/login"
      className="text-blue-600 hover:underline font-semibold"
    >
      Login
    </Link>
  </p>
</div>
      </div>
    </div>
  )
}

export default Signup