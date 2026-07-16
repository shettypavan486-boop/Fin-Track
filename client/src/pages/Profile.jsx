import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'

function Profile() {
  const dispatch = useDispatch()

const { user } = useSelector((state) => state.auth)

const [profile, setProfile] = useState({
  name: '',
  email: ''
})

const [passwords, setPasswords] = useState({
  currentPassword: '',
  newPassword: ''
})

const [stats, setStats] = useState(null)

const [message, setMessage] = useState('')

const [error, setError] = useState('')

  useEffect(() => {
  if (user) {
    setProfile({
      name: user.name || '',
      email: user.email || ''
    })
  }

  const loadStats = async () => {
    try {
      const response = await getAccountStats()
      setStats(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  loadStats()
}, [user])

  const saveProfile = async (event) => {
  event.preventDefault()

  setMessage('')
  setError('')

  try {
    await dispatch(updateProfileThunk(profile)).unwrap()

    setMessage('Profile updated successfully.')
  } catch (err) {
    setError(err || 'Failed to update profile.')
  }
}

  const savePassword = async (event) => {
  event.preventDefault()

  setMessage('')
  setError('')

  try {
    await changePassword(passwords)

    setPasswords({
      currentPassword: '',
      newPassword: ''
    })

    setMessage('Password changed successfully.')
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      'Failed to change password.'
    )
  }
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
  Profile
</h1>

<p className="mt-1 text-gray-500">
  Manage your account information and security.
</p>
      </div>

      {message && (
  <div className="rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
    {message}
  </div>
)}
      {error && (
  <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-semibold">
  User Details
</h2>
          <form onSubmit={saveProfile} className="mt-4 grid gap-4 md:grid-cols-2">
            <>
  <div>
    <label className="mb-1 block text-sm font-medium">
      Name
    </label>

    <input
      type="text"
      value={profile.name}
      onChange={(e) =>
        setProfile({
          ...profile,
          name: e.target.value
        })
      }
      className="w-full rounded-lg border px-4 py-2"
      required
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      Email
    </label>

    <input
      type="email"
      value={profile.email}
      onChange={(e) =>
        setProfile({
          ...profile,
          email: e.target.value
        })
      }
      className="w-full rounded-lg border px-4 py-2"
      required
    />
  </div>

  <div className="md:col-span-2">
    <button
      type="submit"
      className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
    >
      Save Profile
    </button>
  </div>
</>
          </form>

          <h2 className="mt-8 text-xl font-semibold">
  Change Password
</h2>
          <form onSubmit={savePassword} className="mt-4 grid gap-4 md:grid-cols-2">
            <>
  <div>
    <label className="mb-1 block text-sm font-medium">
      Current Password
    </label>

    <input
      type="password"
      value={passwords.currentPassword}
      onChange={(e) =>
        setPasswords({
          ...passwords,
          currentPassword: e.target.value
        })
      }
      className="w-full rounded-lg border px-4 py-2"
      required
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      New Password
    </label>

    <input
      type="password"
      minLength={6}
      value={passwords.newPassword}
      onChange={(e) =>
        setPasswords({
          ...passwords,
          newPassword: e.target.value
        })
      }
      className="w-full rounded-lg border px-4 py-2"
      required
    />
  </div>

  <div className="md:col-span-2">
    <button
      type="submit"
      className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
    >
      Change Password
    </button>
  </div>
</>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
  Account Statistics
</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
  <span>Total Transactions</span>
  <span>{stats?.totalTransactions || 0}</span>
</div>

<div className="flex justify-between">
  <span>Total Income</span>
  <span className="font-semibold text-green-600">
    {formatCurrency(stats?.totalIncome || 0)}
  </span>
</div>

<div className="flex justify-between">
  <span>Total Expenses</span>
  <span className="font-semibold text-red-600">
    {formatCurrency(stats?.totalExpense || 0)}
  </span>
</div>

<div className="flex justify-between">
  <span>Savings</span>
  <span className="font-semibold text-blue-600">
    {formatCurrency(stats?.savings || 0)}
  </span>
</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile