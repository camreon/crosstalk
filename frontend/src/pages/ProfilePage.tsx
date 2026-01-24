import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { FETCH_USER, UPDATE_USER } from '../actions/userActions';
import { FETCH_USER_RESPONSES } from '../actions/responseActions';
import { FETCH_TOPICS } from '../actions/topicActions';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const viewedUser = useAppSelector((state) => state.user.viewedUser);
  const userResponses = useAppSelector((state) => state.responses.userResponses);
  const topics = useAppSelector((state) => state.topics.topics);
  const { loading } = useAppSelector((state) => state.feedback);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  // Determine which user to show
  const isOwnProfile = !username || username === currentUser?.username;
  const profileUser = isOwnProfile ? currentUser : viewedUser;

  useEffect(() => {
    dispatch(FETCH_TOPICS());
    
    if (isOwnProfile && currentUser) {
      dispatch(FETCH_USER_RESPONSES(currentUser.id));
    } else if (username) {
      dispatch(FETCH_USER(username));
    }
  }, [dispatch, isOwnProfile, currentUser, username]);

  useEffect(() => {
    if (viewedUser && !isOwnProfile) {
      dispatch(FETCH_USER_RESPONSES(viewedUser.id));
    }
  }, [dispatch, viewedUser, isOwnProfile]);

  useEffect(() => {
    if (profileUser) {
      setDisplayName(profileUser.display_name || '');
      setBlogUrl(profileUser.blog_url || '');
    }
  }, [profileUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    await dispatch(
      UPDATE_USER({
        username: currentUser.username,
        displayName: displayName || undefined,
        blogUrl: blogUrl || undefined,
      })
    );
    setIsEditing(false);
  };

  // Group responses by topic
  const responsesByTopic = userResponses.reduce((acc, response) => {
    if (!acc[response.topic_id]) {
      acc[response.topic_id] = [];
    }
    acc[response.topic_id].push(response);
    return acc;
  }, {} as Record<number, typeof userResponses>);

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profileUser.display_name || profileUser.username}
            </h1>
            <p className="text-gray-500">@{profileUser.username}</p>
            {profileUser.blog_url && (
              <a
                href={profileUser.blog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block"
              >
                {profileUser.blog_url}
              </a>
            )}
          </div>
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog URL (Substack, Medium, etc.)
              </label>
              <input
                type="url"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="https://yourname.substack.com"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {userResponses.length}
          </div>
          <div className="text-sm text-gray-500">Questions Answered</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {Object.keys(responsesByTopic).length}
          </div>
          <div className="text-sm text-gray-500">Topics Covered</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {topics.filter(t => {
              const answered = responsesByTopic[t.id]?.length || 0;
              return answered === t.question_count;
            }).length}
          </div>
          <div className="text-sm text-gray-500">Topics Complete</div>
        </div>
      </div>

      {/* Political Positions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Political Positions</h2>
        <div className="space-y-4">
          {topics.map((topic) => {
            const topicResponses = responsesByTopic[topic.id] || [];
            if (topicResponses.length === 0) return null;

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{topic.name}</h3>
                <div className="space-y-3">
                  {topicResponses.map((response) => (
                    <div key={response.id} className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{response.question_text}</p>
                        <p className="text-sm font-medium text-indigo-600 mt-1">
                          {formatAnswer(response.answer, response.question_type)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {Object.keys(responsesByTopic).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No survey responses yet.</p>
              {isOwnProfile && (
                <a href="/topics" className="text-indigo-600 hover:text-indigo-700 text-sm mt-1 inline-block">
                  Take the survey →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatAnswer(answer: string, questionType: string): string {
  if (questionType === 'likert') {
    const labels: Record<string, string> = {
      '1': 'Strongly Disagree',
      '2': 'Disagree',
      '3': 'Neutral',
      '4': 'Agree',
      '5': 'Strongly Agree',
    };
    return labels[answer] || answer;
  }
  if (questionType === 'yes_no') {
    const labels: Record<string, string> = {
      yes: 'Yes',
      no: 'No',
      depends: 'It Depends',
    };
    return labels[answer] || answer;
  }
  return answer;
}
