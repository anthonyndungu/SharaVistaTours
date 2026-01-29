import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../features/auth/authSlice'
import { UserIcon } from '@heroicons/react/24/outline'
import Spinner from '../../components/Spinner'

// Note: You'll need to implement fetchAllUsers in your authSlice
// For now, we'll create a basic implementation

export default function ManageUsers() {
  const dispatch = useDispatch()
  // const { users, loading, error } = useSelector((state) => state.auth)

  // Since we don't have fetchAllUsers implemented yet, we'll show a placeholder
  // In a real app, you would implement this endpoint in your backend

  useEffect(() => {
    // dispatch(fetchAllUsers())
  }, [dispatch])

  // Mock data for demonstration
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@travelease.com', role: 'super_admin', createdAt: '2024-01-15' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'client', createdAt: '2024-01-20' },
    { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'client', createdAt: '2024-01-25' },
    { id: '4', name: 'Mike Wilson', email: 'mike@example.com', role: 'admin', createdAt: '2024-02-01' }
  ]

  // const loading = false
  // const error = null

  // if (loading) return <div className="py-12"><Spinner /></div>

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Users</h1>

      {/* Note about implementation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-800">
          <strong>Note:</strong> User management functionality requires additional backend endpoints 
          (GET /api/v1/users, PATCH /api/v1/users/:id/role, DELETE /api/v1/users/:id). 
          This is a placeholder implementation showing the UI structure.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      Edit Role
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}