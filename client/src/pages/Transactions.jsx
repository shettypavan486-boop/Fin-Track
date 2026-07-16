import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'
import { categories, formatCurrency, formatDate, paymentMethods } from '../utils/format'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

function Transactions() {
  const dispatch = useDispatch()

const {
  transactions,
  pagination,
  loading,
  error
} = useSelector((state) => state.transactions)

const [filters, setFilters] = useState({
  search: '',
  type: '',
  category: '',
  sort: 'latest',
  page: 1
})

const [form, setForm] = useState(emptyForm)

const [editingId, setEditingId] = useState(null)

const [showForm, setShowForm] = useState(false)

const [message, setMessage] = useState('')

  const query = useMemo(
  () => ({
    ...filters,
    limit: 10
  }),
  [filters]
)

  useEffect(() => {
  dispatch(fetchTransactions(query))
}, [dispatch, query])

  const openCreate = () => {
  setEditingId(null)
  setForm(emptyForm)
  setShowForm(true)
}

  const openEdit = (item) => {
  setEditingId(item._id)

  setForm({
    type: item.type,
    title: item.title,
    amount: item.amount,
    category: item.category,
    paymentMethod: item.paymentMethod,
    description: item.description || '',
    transactionDate: item.transactionDate
      ? item.transactionDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  })

  setShowForm(true)
}

  const submitForm = async (event) => {
  event.preventDefault()

  setMessage('')

  try {
    await dispatch(
      saveTransaction({
        id: editingId,
        data: form
      })
    ).unwrap()

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)

    dispatch(fetchTransactions(query))

    setMessage(
      editingId
        ? 'Transaction updated successfully.'
        : 'Transaction added successfully.'
    )
  } catch (err) {
    setMessage(err || 'Failed to save transaction.')
  }
}

  const deleteItem = async (item) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${item.title}"?`
  )

  if (!confirmed) return

  setMessage('')

  try {
    await dispatch(removeTransactionById(item._id)).unwrap()

    dispatch(fetchTransactions(query))

    setMessage('Transaction deleted successfully.')
  } catch (err) {
    setMessage(err || 'Failed to delete transaction.')
  }
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
  Transactions
</h1>

<p className="text-gray-500 mt-1">
  Manage all your income and expense records
</p>
        </div>
        <button
  onClick={openCreate}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  + Add Transaction
</button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <input
  type="text"
  placeholder="Search..."
  value={filters.search}
  onChange={(e) =>
    setFilters({
      ...filters,
      search: e.target.value,
      page: 1
    })
  }
  className="border rounded-lg px-4 py-2 w-full"
/>

          <select
  value={filters.type}
  onChange={(e) =>
    setFilters({
      ...filters,
      type: e.target.value,
      page: 1
    })
  }
  className="border rounded-lg px-3 py-2"
>
  <option value="">All Types</option>
  <option value="income">Income</option>
  <option value="expense">Expense</option>
</select>

          <select
  value={filters.category}
  onChange={(e) =>
    setFilters({
      ...filters,
      category: e.target.value,
      page: 1
    })
  }
  className="border rounded-lg px-3 py-2"
>
  <option value="">All Categories</option>

  {categories.map((category) => (
    <option
      key={category}
      value={category}
    >
      {category}
    </option>
  ))}
</select>

          <select
  value={filters.sort}
  onChange={(e) =>
    setFilters({
      ...filters,
      sort: e.target.value,
      page: 1
    })
  }
  className="border rounded-lg px-3 py-2"
>
  <option value="latest">Latest</option>
  <option value="oldest">Oldest</option>
  <option value="amount_desc">Amount (High → Low)</option>
  <option value="amount_asc">Amount (Low → High)</option>
</select>

          <button
  onClick={() =>
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }
  className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 transition"
>
  Reset
</button>

        </div>
      </section>

      {error && (
  <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}

{message && (
  <div className="rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
    {message}
  </div>
)}

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Title</th>
<th className="px-4 py-3">Type</th>
<th className="px-4 py-3">Category</th>
<th className="px-4 py-3">Date</th>
<th className="px-4 py-3">Payment</th>
<th className="px-4 py-3 text-right">Amount</th>
<th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
<tr>
  <td colSpan={7} className="px-4 py-8 text-center">
    Loading transactions...
  </td>
</tr>

                  ) : transactions.length ? (

transactions.map((item) => (

<tr key={item._id}>

<td className="px-4 py-3 font-medium">
  {item.title}
</td>

<td className="px-4 py-3 capitalize">
  {item.type}
</td>

<td className="px-4 py-3">
  {item.category}
</td>

<td className="px-4 py-3">
  {formatDate(item.transactionDate)}
</td>

<td className="px-4 py-3 capitalize">
  {item.paymentMethod}
</td>

<td
  className={`px-4 py-3 text-right font-semibold ${
    item.type === 'income'
      ? 'text-green-600'
      : 'text-red-600'
  }`}
>
  {formatCurrency(item.amount)}
</td>

<td className="px-4 py-3">

<div className="flex justify-center gap-2">

<button
  onClick={() => openEdit(item)}
  className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
>
  Edit
</button>

<button
  onClick={() => deleteItem(item)}
  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
>
  Delete
</button>

</div>

</td>

</tr>

))

                  ) : (

<tr>

<td
  colSpan={7}
  className="px-4 py-8 text-center text-gray-500"
>
  No transactions found.
</td>

</tr>

)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
          <span>
  Page {pagination?.page || 1} of {pagination?.totalPages || 1}
</span>

          <div className="flex gap-2">
  <button
    disabled={!pagination || pagination.page <= 1}
    onClick={() =>
      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1
      }))
    }
    className="rounded border px-4 py-2 disabled:opacity-50"
  >
    Previous
  </button>

  <button
    disabled={
      !pagination || pagination.page >= pagination.totalPages
    }
    onClick={() =>
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1
      }))
    }
    className="rounded border px-4 py-2 disabled:opacity-50"
  >
    Next
  </button>
</div>
        </div>
      </section>

      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {editingId ? 'Edit Transaction' : 'Add Transaction'}
        </h2>

        <button
          onClick={() => setShowForm(false)}
          className="rounded px-3 py-1 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <form onSubmit={submitForm} className="space-y-4">

        <div className="grid gap-4 md:grid-cols-2">

  <div>
    <label className="mb-1 block text-sm font-medium">
      Type
    </label>

    <select
      value={form.type}
      onChange={(e) =>
        setForm({
          ...form,
          type: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
    >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      Title
    </label>

    <input
      type="text"
      value={form.title}
      onChange={(e) =>
        setForm({
          ...form,
          title: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
      required
    />
  </div>

</div>

<div className="grid gap-4 md:grid-cols-2">

  <div>
    <label className="mb-1 block text-sm font-medium">
      Amount
    </label>

    <input
      type="number"
      value={form.amount}
      onChange={(e) =>
        setForm({
          ...form,
          amount: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
      required
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      Category
    </label>

    <select
      value={form.category}
      onChange={(e) =>
        setForm({
          ...form,
          category: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
    >
      {categories.map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </select>
  </div>

</div>

<div className="grid gap-4 md:grid-cols-2">

  <div>
    <label className="mb-1 block text-sm font-medium">
      Payment Method
    </label>

    <select
      value={form.paymentMethod}
      onChange={(e) =>
        setForm({
          ...form,
          paymentMethod: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
    >
      {paymentMethods.map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      Transaction Date
    </label>

    <input
      type="date"
      value={form.transactionDate}
      onChange={(e) =>
        setForm({
          ...form,
          transactionDate: e.target.value
        })
      }
      className="w-full rounded-lg border px-3 py-2"
      required
    />
  </div>

</div>

<div>
  <label className="mb-1 block text-sm font-medium">
    Description
  </label>

  <textarea
    rows={3}
    value={form.description}
    onChange={(e) =>
      setForm({
        ...form,
        description: e.target.value
      })
    }
    className="w-full rounded-lg border px-3 py-2"
    placeholder="Enter description..."
  />
</div>

<div className="flex justify-end gap-3 pt-2">

  <button
    type="button"
    onClick={() => setShowForm(false)}
    className="rounded-lg border px-5 py-2 hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={loading}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? 'Saving...' : 'Save Transaction'}
  </button>

</div>

      </form>

    </div>
  </div>
)}
    </div>
  )
}

export default Transactions