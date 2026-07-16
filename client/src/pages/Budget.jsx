import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'

function Budget() {
  const dispatch = useDispatch()

const budget = useSelector((state) => state.budget)

const [monthlyBudget, setMonthlyBudget] = useState(0)

const [categoryBudgets, setCategoryBudgets] = useState([])

const [summary, setSummary] = useState(null)

const [message, setMessage] = useState('')

  useEffect(() => {
  dispatch(fetchBudget())

  const loadSummary = async () => {
    try {
      const response = await getDashboardSummary()
      setSummary(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  loadSummary()
}, [dispatch])

  useEffect(() => {
  setMonthlyBudget(budget.monthlyBudget || 0)

  setCategoryBudgets(budget.categories || [])
}, [budget.monthlyBudget, budget.categories])

  const addCategory = () => {
  setCategoryBudgets([
    ...categoryBudgets,
    {
      category: categories[0],
      limit: 0
    }
  ])
}

  const updateCategory = (index, field, value) => {
  const updated = [...categoryBudgets]

  updated[index][field] = value

  setCategoryBudgets(updated)
}

  const removeCategory = (index) => {
  setCategoryBudgets(
    categoryBudgets.filter((_, i) => i !== index)
  )
}

  const save = async (event) => {
  event.preventDefault()

  setMessage('')

  try {
    await dispatch(
      saveBudget({
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets: categoryBudgets.map((item) => ({
          ...item,
          limit: Number(item.limit)
        }))
      })
    ).unwrap()

    const response = await getDashboardSummary()
    setSummary(response.data.data)

    setMessage('Budget saved successfully.')
  } catch (error) {
    setMessage(error || 'Failed to save budget.')
  }
}
  const totalExpense = summary?.totalExpense || 0

const remaining = monthlyBudget - totalExpense

const usedPercent =
  monthlyBudget > 0
    ? Math.min((totalExpense / monthlyBudget) * 100, 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
  Budget Management
</h1>

<p className="mt-1 text-gray-500">
  Set monthly and category-wise spending limits.
</p>
      </div>

      {message && (
  <div className="rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
    {message}
  </div>
)}
      {budget.error && (
  <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {budget.error}
  </div>
)}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <form onSubmit={save} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
  Monthly Budget
</label>

<input
  type="number"
  value={monthlyBudget}
  onChange={(e) => setMonthlyBudget(e.target.value)}
  className="w-full rounded-lg border px-4 py-3"
  placeholder="Enter monthly budget"
  required
/>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
  Category Budgets
</h2>

<button
  type="button"
  onClick={addCategory}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  + Add Category
</button>
            </div>

            <div className="space-y-3">
              {categoryBudgets.map((item, index) => {
  const spent =
    summary?.categoryBreakdown?.find(
      (c) => c.category === item.category
    )?.amount || 0

  const percent =
    item.limit > 0
      ? Math.min((spent / item.limit) * 100, 100)
      : 0

  return (
    <div
      key={index}
      className="rounded-lg border p-4"
    >
      <div className="grid gap-4 md:grid-cols-3">

        <select
          value={item.category}
          onChange={(e) =>
            updateCategory(index, 'category', e.target.value)
          }
          className="rounded-lg border px-3 py-2"
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

        <input
          type="number"
          value={item.limit}
          onChange={(e) =>
            updateCategory(index, 'limit', e.target.value)
          }
          className="rounded-lg border px-3 py-2"
        />

        <button
          type="button"
          onClick={() => removeCategory(index)}
          className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
        >
          Remove
        </button>

      </div>

      <div className="mt-4">

        <div className="mb-2 flex justify-between text-sm">
          <span>
            {formatCurrency(spent)}
          </span>

          <span>
            {percent.toFixed(0)}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-gray-200">

          <div
            className={`h-3 rounded-full ${
              percent >= 100
                ? 'bg-red-500'
                : 'bg-green-500'
            }`}
            style={{
              width: `${percent}%`
            }}
          />

        </div>

      </div>

    </div>
  )
})}
            </div>

            <button
  type="submit"
  disabled={budget.loading}
  className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
>
  {budget.loading ? 'Saving...' : 'Save Budget'}
</button>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
  Monthly Progress
</h2>
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between">
  <span className="font-medium">Spent</span>

  <span className="text-red-600 font-semibold">
    {formatCurrency(totalExpense)}
  </span>
</div>
            </div>
            <div>
              <div className="flex justify-between">
  <span className="font-medium">Remaining</span>

  <span
    className={`font-semibold ${
      remaining < 0
        ? 'text-red-600'
        : 'text-green-600'
    }`}
  >
    {formatCurrency(remaining)}
  </span>
</div>
            </div>
            <div>
              <div>
  <div className="mb-2 flex justify-between text-sm">
    <span>Budget Used</span>

    <span>{usedPercent.toFixed(0)}%</span>
  </div>

  <div className="h-4 rounded-full bg-gray-200">
    <div
      className={`h-4 rounded-full ${
        usedPercent >= 100
          ? 'bg-red-500'
          : 'bg-sky-500'
      }`}
      style={{
        width: `${usedPercent}%`
      }}
    />
  </div>
</div>
            </div>
            {remaining < 0 && (
  <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
    ⚠️ You have exceeded your monthly budget.
  </div>
)}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Budget