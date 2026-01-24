import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { FETCH_ALL_USERS } from '../actions/userActions';
import { COMPARE_USERS } from '../actions/compareActions';

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const allUsers = useAppSelector((state) => state.user.allUsers);
  const { loading } = useAppSelector((state) => state.feedback);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(FETCH_ALL_USERS());
  }, [dispatch]);

  // Filter out current user
  const otherUsers = allUsers.filter((u) => u.id !== currentUser?.id);

  const handleCompare = async () => {
    if (!currentUser || !selectedUserId) return;

    const result = await dispatch(
      COMPARE_USERS({ user1Id: currentUser.id, user2Id: selectedUserId })
    );

    if (COMPARE_USERS.fulfilled.match(result)) {
      navigate('/compare/result');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Common Ground</h1>
        <p className="text-gray-600 mt-1">
          Select someone to compare your political views with. Our AI will help identify areas of agreement and suggest constructive talking points.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Select a User</h2>

        {otherUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No other users have signed up yet.</p>
            <p className="text-sm mt-1">Invite someone to join and compare views!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {otherUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedUserId === user.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.display_name || user.username}
                    </div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-indigo-600">
                      {user.response_count || 0} answers
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUserId && (
        <div className="flex justify-end">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Compare Views'}
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-2">How it works</h3>
        <ol className="text-sm text-gray-600 space-y-2">
          <li>1. Both users complete survey questions on political topics</li>
          <li>2. Our system finds questions both users have answered</li>
          <li>3. AI analyzes the responses to find common ground</li>
          <li>4. You get talking points for constructive conversation</li>
        </ol>
      </div>
    </div>
  );
}
