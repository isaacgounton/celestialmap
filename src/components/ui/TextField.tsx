interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "number" | "password" | "tel";
  className?: string;
  error?: string;
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  error
}: TextFieldProps) {
  return (
    <div>
      <input
        className={`p-4 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}