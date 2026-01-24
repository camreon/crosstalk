import { Link } from 'react-router-dom';
import { useAppSelector } from '../reducers/hooks';

export default function CompareResultPage() {
  const compareResult = useAppSelector((state) => state.compare.result);

  if (!compareResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No comparison data available.</p>
        <Link to="/compare" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
          ← Start a new comparison
        </Link>
      </div>
    );
  }

  const { user1, user2, shared_questions, agreements, disagreements, ai_analysis, message } = compareResult;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link to="/compare" className="text-indigo-600 hover:text-indigo-700 text-sm">
          ← Compare with someone else
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Comparison Results</h1>
      </div>

      {/* Users being compared */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-indigo-600">
                {(user1.display_name || user1.username)[0].toUpperCase()}
              </span>
            </div>
            <div className="font-medium text-gray-900">
              {user1.display_name || user1.username}
            </div>
            <div className="text-sm text-gray-500">@{user1.username}</div>
          </div>
          <div className="px-4">
            <span className="text-2xl text-gray-300">⟷</span>
          </div>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-purple-600">
                {(user2.display_name || user2.username)[0].toUpperCase()}
              </span>
            </div>
            <div className="font-medium text-gray-900">
              {user2.display_name || user2.username}
            </div>
            <div className="text-sm text-gray-500">@{user2.username}</div>
          </div>
        </div>
      </div>

      {message ? (
        <div className="bg-yellow-50 rounded-xl p-6 text-center">
          <p className="text-yellow-800">{message}</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{shared_questions}</div>
              <div className="text-sm text-gray-500">Shared Questions</div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{agreements?.length || 0}</div>
              <div className="text-sm text-green-700">Agreements</div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{disagreements?.length || 0}</div>
              <div className="text-sm text-orange-700">Disagreements</div>
            </div>
          </div>

          {/* AI Analysis */}
          {ai_analysis && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h2>
                <p className="text-gray-700">{ai_analysis.summary}</p>
              </div>

              {ai_analysis.common_ground.length > 0 && (
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Common Ground</h3>
                  <ul className="space-y-2">
                    {ai_analysis.common_ground.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_analysis.areas_of_nuance.length > 0 && (
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Areas of Nuance</h3>
                  <ul className="space-y-2">
                    {ai_analysis.areas_of_nuance.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">◎</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_analysis.talking_points.length > 0 && (
                <div>
                  <h3 className="font-medium text-purple-800 mb-2">Talking Points</h3>
                  <ul className="space-y-2">
                    {ai_analysis.talking_points.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">→</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_analysis.conversation_starters.length > 0 && (
                <div>
                  <h3 className="font-medium text-indigo-800 mb-2">Conversation Starters</h3>
                  <ul className="space-y-2">
                    {ai_analysis.conversation_starters.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">?</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Agreements */}
          {agreements && agreements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas of Agreement</h2>
              <div className="space-y-3">
                {agreements.map((item, i) => (
                  <div key={i} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700 font-medium mb-1">{item.topic_name}</div>
                    <div className="text-gray-800">{item.question_text}</div>
                    <div className="mt-2 text-sm text-green-700">
                      Both answered: <span className="font-medium">{item.user1_answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disagreements */}
          {disagreements && disagreements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas of Difference</h2>
              <div className="space-y-3">
                {disagreements.map((item, i) => (
                  <div key={i} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-orange-700 font-medium mb-1">{item.topic_name}</div>
                    <div className="text-gray-800">{item.question_text}</div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">{user1.display_name || user1.username}:</span>
                        <span className="ml-1 font-medium text-gray-700">{item.user1_answer}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{user2.display_name || user2.username}:</span>
                        <span className="ml-1 font-medium text-gray-700">{item.user2_answer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
