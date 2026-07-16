import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { downloadMonthlyReport, getMonthlyReport } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'

function Reports() {
  const today = new Date()

const [period, setPeriod] = useState({
  month: today.getMonth() + 1,
  year: today.getFullYear()
})

const [report, setReport] = useState(null)

const [loading, setLoading] = useState(true)

const [error, setError] = useState('')

  const params = useMemo(
  () => ({
    ...period
  }),
  [period]
)

  useEffect(() => {
  const loadReport = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getMonthlyReport(params)
      setReport(response.data.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load report'
      )
    } finally {
      setLoading(false)
    }
  }

  loadReport()
}, [params])

  const exportPdf = async () => {
  try {
    const response = await downloadMonthlyReport(params)

    const blob = new Blob([response.data], {
      type: 'application/pdf'
    })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.download = `finance-report-${period.year}-${String(period.month).padStart(2, '0')}.pdf`

    link.click()

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
  Reports
</h1>

<p className="mt-1 text-gray-500">
  View and export your monthly financial reports.
</p>
        </div>
        <button
  onClick={exportPdf}
  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
>
  Export PDF
</button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <select
  value={period.month}
  onChange={(e) =>
    setPeriod({
      ...period,
      month: Number(e.target.value)
    })
  }
  className="rounded-lg border px-3 py-2"
>
  {[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ].map((month, index) => (
    <option
      key={month}
      value={index + 1}
    >
      {month}
    </option>
  ))}
</select>
          <input
  type="number"
  value={period.year}
  onChange={(e) =>
    setPeriod({
      ...period,
      year: Number(e.target.value)
    })
  }
  className="rounded-lg border px-3 py-2"
/>
        </div>
      </section>

      {loading && (
  <div className="rounded-lg bg-white p-8 text-center shadow-sm">
    Loading report...
  </div>
)}
      {error && (
  <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}

      {report && !loading && (
  <>
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-gray-500">Income</h3>
        <p className="mt-2 text-2xl font-bold text-green-600">
          {formatCurrency(report?.totalIncome || 0)}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-gray-500">Expense</h3>
        <p className="mt-2 text-2xl font-bold text-red-600">
          {formatCurrency(report?.totalExpense || 0)}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-gray-500">Savings</h3>
        <p className="mt-2 text-2xl font-bold text-blue-600">
          {formatCurrency(report?.savings || 0)}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="text-gray-500">Remaining</h3>
        <p className="mt-2 text-2xl font-bold text-purple-600">
          {formatCurrency(report?.remaining || 0)}
        </p>
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
        <h2 className="text-xl font-semibold">Category Analytics</h2>

        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report?.categoryBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="mt-4 max-h-72 space-y-3 overflow-auto">
          {report?.transactions?.length ? (
            report.transactions.map((item) => (
              <div
                key={item._id}
                className="rounded border p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.category} • {formatDate(item.transactionDate)}
                  </p>
                </div>

                <span
                  className={
                    item.type === 'income'
                      ? 'font-semibold text-green-600'
                      : 'font-semibold text-red-600'
                  }
                >
                  {item.type === 'income' ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No transactions for this period.
            </p>
          )}
        </div>
      </section>
    </div>
  </>
)}
</div>
  )
}


export default Reports