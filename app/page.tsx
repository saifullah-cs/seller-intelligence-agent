export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Advanced Web Development Project
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Seller Intelligence Agent
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Analyze marketplace products, pricing, keywords, and seller
            opportunities using real marketplace data and AI.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <label
            htmlFor="product"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product or keyword
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="product"
              type="text"
              placeholder="e.g. wooden wall decor"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

            <button
              type="button"
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Analyze
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Product Research</h2>
            <p className="mt-2 text-sm text-gray-600">
              Find relevant marketplace listings for a product or keyword.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Market Analysis</h2>
            <p className="mt-2 text-sm text-gray-600">
              Analyze prices, keywords, and other available listing data.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">AI Insights</h2>
            <p className="mt-2 text-sm text-gray-600">
              Generate seller-oriented insights from the retrieved data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}