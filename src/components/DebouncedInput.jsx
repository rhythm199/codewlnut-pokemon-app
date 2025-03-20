import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceMs = 500,
  className = "",
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedCallback = useCallback(
    debounce((value) => onChange(value), debounceMs),
    [onChange, debounceMs],
  );

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    debouncedCallback(newValue);
  };

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
      className={`
        px-4 
        py-2 
        rounded-lg 
        border 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-500 
        dark:bg-gray-800 
        dark:border-gray-700 
        dark:text-white 
        transition-colors 
        duration-200
        ${className}
      `}
    />
  );
}
