import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { logout } from '../reducers/userReducer';

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { loading, error } = useAppSelector((state) => state.feedback);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                CrossTalk
              </Link>
              {currentUser && (
                <div className="flex gap-6">
                  <Link to="/topics" className="text-gray-600 hover:text-gray-900">
                    Survey
                  </Link>
                  <Link to="/compare" className="text-gray-600 hover:text-gray-900">
                    Compare
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                </div>
              )}
            </div>
            {currentUser && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {currentUser.display_name || currentUser.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {loading && (
        <div className="bg-indigo-50 border-b border-indigo-100">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <p className="text-sm text-indigo-600">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-b border-red-100">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
