import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsights, fetchPrediction } from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'

function Insights() {
  const dispatch = useDispatch()

const {
  insights,
  predictions,
  provider,
  loading,
  error
} = useSelector((state) => state.insights)

  useEffect(() => {
  dispatch(fetchInsights())
  dispatch(fetchPrediction())
}, [dispatch])

  const refresh = () => {
  dispatch(fetchInsights())
  dispatch(fetchPrediction())
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
  AI Insights
</h1>

<p className="mt-1 text-gray-500">
  Personalized spending recommendations powered by AI.
</p>
        </div>
        <button
  onClick={refresh}
  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
>
  Refresh Insights
</button>
      </div>

      {error && (
  <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
    {error}
  </div>
)}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center justify-between">
  <h2 className="text-xl font-semibold">
    Recommendations
  </h2>

  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
    {provider || 'heuristic'}
  </span>
</div>
          </div>
          {loading ? (

  <div className="py-10 text-center text-gray-500">
    Generating insights...
  </div>

) : insights?.length ? (

  <div className="space-y-4">

    {insights.map((item, index) => (

      <div
        key={index}
        className="rounded-lg border border-blue-200 bg-blue-50 p-4"
      >
        <h3 className="font-semibold text-blue-700">
          {item.title || `Recommendation ${index + 1}`}
        </h3>

        <p className="mt-2 text-gray-700">
          {item.message || item.description || item}
        </p>
      </div>

    ))}

  </div>

) : (

  <div className="py-10 text-center text-gray-500">
    Add transactions to generate insights.
  </div>

)}
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
  Spending Prediction
</h2>
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between">
  <span className="font-medium">
    Predicted Expense
  </span>

  <span className="font-semibold text-red-600">
    {formatCurrency(predictions?.predictedExpense || 0)}
  </span>
</div>
            </div>
            <div>
              <div>
  <div className="mb-2 flex justify-between">
    <span>Confidence</span>

    <span>
      {predictions?.confidence || 0}%
    </span>
  </div>

  <div className="h-3 rounded-full bg-gray-200">
    <div
      className="h-3 rounded-full bg-green-500"
      style={{
        width: `${predictions?.confidence || 0}%`
      }}
    />
  </div>
</div>
            </div>
            {predictions?.budgetRisk && (
  <div className="rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-yellow-800">
    ⚠️ Predicted spending is above your monthly budget.
  </div>
)}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Insights