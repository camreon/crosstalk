interface LikertQuestionProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const LIKERT_OPTIONS = [
  { value: '1', label: 'Strongly Disagree', color: 'bg-red-500' },
  { value: '2', label: 'Disagree', color: 'bg-orange-400' },
  { value: '3', label: 'Neutral', color: 'bg-gray-400' },
  { value: '4', label: 'Agree', color: 'bg-lime-400' },
  { value: '5', label: 'Strongly Agree', color: 'bg-green-500' },
];

export default function LikertQuestion({ value, onChange }: LikertQuestionProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {LIKERT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-3 rounded-lg border-2 transition font-medium text-sm ${
              value === option.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            {option.value}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Strongly Disagree</span>
        <span>Neutral</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
}
