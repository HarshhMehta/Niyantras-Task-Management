import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Globe, Building2 } from 'lucide-react'

const UserCard = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-xs text-gray-400">@{user.username}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-gray-400" />
          <span>{user.website}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-gray-400" />
          <span>{user.company.name}</span>
        </div>
      </div>
      <button
        onClick={() => navigate(`/users/${user.id}`)}
        className="mt-4 w-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg transition-colors font-medium"
      >
        View Details
      </button>
    </div>
  )
}

export default UserCard