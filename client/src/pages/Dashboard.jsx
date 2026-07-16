import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import SummaryCard from '../components/dashboard/SummaryCard'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'

const COLORS = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']

function Dashboard() {
  const [summary, setSummary] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await getDashboardSummary()
      setSummary(response.data.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  fetchDashboard()
}, [])

  if (loading) {
  return (
    <div className="text-center py-20 text-lg">
      Loading dashboard...
    </div>
  )
}

  if (error) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
      {error}
    </div>
  )
}

  const trend = summary?.monthlyTrend || []

const categories = summary?.categoryBreakdown || []

const incomeExpense = trend.map(item => ({
  month: item.month,
  Income: item.income,
  Expense: item.expense
}))

  return (
    <div className="space-y-6">
      <div>
        <div>
  <h1 className="text-3xl font-bold text-gray-800">
    Dashboard
  </h1>

  <p className="text-gray-500 mt-1">
    Overview of your financial activity
  </p>
</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

  <SummaryCard
    label="Total Income"
    value={formatCurrency(summary?.totalIncome || 0)}
    tone="green"
/>

  <SummaryCard
    label="Total Expense"
    value={formatCurrency(summary?.totalExpense || 0)}
    tone="red"
/>

<SummaryCard
    label="Savings"
    value={formatCurrency(summary?.savings || 0)}
    tone="blue"
/>

<SummaryCard
    label="Remaining Budget"
    value={formatCurrency(summary?.budgetRemaining || 0)}
    tone="slate"
/>

</div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
  <h2 className="text-lg font-semibold">
    Monthly Spending Trend
  </h2>

  <div className="mt-4 h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trend}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="expense"
          stroke="#dc2626"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
  <h2 className="text-lg font-semibold">
    Category Distribution
  </h2>

  <div className="mt-4 h-72">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categories}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          {categories.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
  <h2 className="text-lg font-semibold">
    Income vs Expense
  </h2>

  <div className="mt-4 h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={incomeExpense}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />

        <Bar
          dataKey="Income"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
        />

        <Bar
          dataKey="Expense"
          fill="#dc2626"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
  <h2 className="text-lg font-semibold">
    Recent Transactions
  </h2>

  <div className="mt-4 space-y-3">

    {summary?.recentTransactions?.length ? (

      summary.recentTransactions.map((transaction) => (

        <div
          key={transaction._id}
          className="flex items-center justify-between border-b pb-3"
        >
          <div>
            <p className="font-medium">
              {transaction.title}
            </p>

            <p className="text-sm text-gray-500">
              {transaction.category} • {formatDate(transaction.date)}
            </p>
          </div>

          <span
            className={
              transaction.type === 'income'
                ? 'font-semibold text-green-600'
                : 'font-semibold text-red-600'
            }
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
        </div>

      ))

    ) : (

      <p className="text-gray-500">
        No transactions yet.
      </p>

    )}

  </div>
</section>
      </div>
    </div>
  )
}

export default Dashboard