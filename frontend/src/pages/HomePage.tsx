import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { FETCH_TOPICS } from '../actions/topicActions';
import { FETCH_USER_RESPONSES } from '../actions/responseActions';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const topics = useAppSelector((state) => state.topics.topics);
  const userResponses = useAppSelector((state) => state.responses.userResponses);

  useEffect(() => {
    dispatch(FETCH_TOPICS());
    if (currentUser) {
      dispatch(FETCH_USER_RESPONSES(currentUser.id));
    }
  }, [dispatch, currentUser]);

  // Calculate stats
  const totalQuestions = topics.reduce((sum, t) => sum + (t.question_count || 0), 0);
  const answeredQuestions = userResponses.length;
  const completionPercentage = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  // Group responses by topic
  const topicsWithResponses = topics.map((topic) => {
    const topicResponses = userResponses.filter((r) => r.topic_id === topic.id);
    return {
      ...topic,
      answered: topicResponses.length,
      complete: topicResponses.length === topic.question_count,
    };
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {currentUser?.display_name || currentUser?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Build your political profile by answering survey questions.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {answeredQuestions} / {totalQuestions} questions
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completionPercentage}% complete
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to="/topics"
          className="bg-indigo-600 text-white rounded-xl p-6 hover:bg-indigo-700 transition"
        >
          <h3 className="font-semibold text-lg">Take Survey</h3>
          <p className="text-indigo-100 text-sm mt-1">
            Answer questions about political topics
          </p>
        </Link>

        <Link
          to="/compare"
          className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition"
        >
          <h3 className="font-semibold text-lg">Find Common Ground</h3>
          <p className="text-purple-100 text-sm mt-1">
            Compare your views with others
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-gray-800 text-white rounded-xl p-6 hover:bg-gray-900 transition"
        >
          <h3 className="font-semibold text-lg">Your Profile</h3>
          <p className="text-gray-300 text-sm mt-1">
            View and share your political profile
          </p>
        </Link>
      </div>

      {/* Topics Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Survey Topics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {topicsWithResponses.map((topic) => (
            <Link
              key={topic.id}
              to={`/survey/${topic.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{topic.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                </div>
                {topic.complete && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    Complete
                  </span>
                )}
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{
                      width: `${(topic.answered / (topic.question_count || 1)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {topic.answered} / {topic.question_count} questions answered
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
