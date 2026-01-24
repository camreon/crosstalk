import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { FETCH_TOPICS } from '../actions/topicActions';
import { FETCH_USER_RESPONSES } from '../actions/responseActions';

export default function TopicsPage() {
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

  // Calculate progress per topic
  const topicsWithProgress = topics.map((topic) => {
    const topicResponses = userResponses.filter((r) => r.topic_id === topic.id);
    const progress = topic.question_count
      ? Math.round((topicResponses.length / topic.question_count) * 100)
      : 0;
    return {
      ...topic,
      answered: topicResponses.length,
      progress,
      complete: topicResponses.length === topic.question_count,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Political Survey</h1>
        <p className="text-gray-600 mt-1">
          Select a topic to answer questions. The more you answer, the better we can help you find common ground with others.
        </p>
      </div>

      <div className="grid gap-4">
        {topicsWithProgress.map((topic) => (
          <Link
            key={topic.id}
            to={`/survey/${topic.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{topic.name}</h2>
                  {topic.complete && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{topic.description}</p>
              </div>
              <div className="text-right ml-4">
                <span className="text-2xl font-bold text-indigo-600">{topic.progress}%</span>
                <p className="text-sm text-gray-500">
                  {topic.answered} / {topic.question_count}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}

        {topics.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No survey topics available yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
