interface MultipleChoiceQuestionProps {
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function MultipleChoiceQuestion({
  options,
  value,
  onChange,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`w-full text-left p-4 rounded-lg border-2 transition ${
            value === option
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                value === option
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300'
              }`}
            >
              {value === option && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span>{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
