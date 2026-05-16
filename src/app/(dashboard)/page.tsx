export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit Report
          </button>
        </div>
      </div>

      {/* Placeholder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Your Score</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">85%</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Reports Submitted</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">4</p>
          <p className="text-sm text-slate-500 mt-2">On track this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Current Rank</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">#3</p>
          <p className="text-sm text-indigo-600 mt-2">In your branch</p>
        </div>
      </div>
    </div>
  );
}
