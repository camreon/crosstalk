import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducers/hooks';
import { FETCH_TOPIC_QUESTIONS } from '../actions/topicActions';
import { SAVE_RESPONSES, FETCH_TOPIC_RESPONSES } from '../actions/responseActions';
import LikertQuestion from '../components/LikertQuestion';
import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion';
import YesNoQuestion from '../components/YesNoQuestion';

export default function SurveyPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentTopic = useAppSelector((state) => state.topics.currentTopic);
  const existingResponses = useAppSelector((state) => state.responses.topicResponses);
  const { loading } = useAppSelector((state) => state.feedback);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (topicId) {
      dispatch(FETCH_TOPIC_QUESTIONS(parseInt(topicId)));
      if (currentUser) {
        dispatch(FETCH_TOPIC_RESPONSES({ userId: currentUser.id, topicId: parseInt(topicId) }));
      }
    }
  }, [dispatch, topicId, currentUser]);

  // Load existing responses into state
  useEffect(() => {
    const existingAnswers: Record<number, string> = {};
    existingResponses.forEach((r) => {
      existingAnswers[r.question_id] = r.answer;
    });
    setAnswers(existingAnswers);
  }, [existingResponses]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    const responsesToSave = Object.entries(answers).map(([questionId, answer]) => ({
      user_id: currentUser.id,
      question_id: parseInt(questionId),
      answer,
    }));

    if (responsesToSave.length === 0) return;

    const result = await dispatch(SAVE_RESPONSES(responsesToSave));
    if (SAVE_RESPONSES.fulfilled.match(result)) {
      setSaved(true);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentTopic?.questions.length || 0;
  const allAnswered = answeredCount === totalQuestions;

  if (!currentTopic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/topics" className="text-indigo-600 hover:text-indigo-700 text-sm">
            ← Back to Topics
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{currentTopic.topic.name}</h1>
          <p className="text-gray-600">{currentTopic.topic.description}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-indigo-600">
            {answeredCount} / {totalQuestions}
          </span>
          <p className="text-sm text-gray-500">questions answered</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentTopic.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
                
                {question.question_type === 'likert' && (
                  <LikertQuestion
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}

                {question.question_type === 'multiple_choice' && question.options && (
                  <MultipleChoiceQuestion
                    options={question.options}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}

                {question.question_type === 'yes_no' && (
                  <YesNoQuestion
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-between">
        <div>
          {saved && (
            <span className="text-green-600 text-sm font-medium">
              ✓ Responses saved
            </span>
          )}
          {!saved && answeredCount > 0 && (
            <span className="text-gray-500 text-sm">
              {answeredCount} unsaved answer{answeredCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading || answeredCount === 0}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Responses'}
          </button>
          {allAnswered && saved && (
            <button
              onClick={() => navigate('/topics')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Next Topic →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
