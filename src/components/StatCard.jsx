const StatCard = ({ title, value, icon, color }) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
    }
  
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
        <div className={`p-3 rounded-lg text-2xl ${colorMap[color] || colorMap.blue}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value ?? '...'}</p>
        </div>
      </div>
    )
  }
  
  export default StatCard