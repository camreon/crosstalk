interface YesNoQuestionProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'depends', label: 'It Depends' },
];

export default function YesNoQuestion({ value, onChange }: YesNoQuestionProps) {
  return (
    <div className="flex gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition ${
            value === option.value
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
