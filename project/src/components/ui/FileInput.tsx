import { FileText, Upload, X } from "lucide-react";
import { ChangeEvent, forwardRef, useRef, useState } from "react";

interface FileInputProps {
  id: string;
  label?: string;
  error?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  value?: File | null;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ id, label, error, accept = ".pdf", onChange, value }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState<string>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFilename(file?.name || "");
      if (onChange) {
        onChange(file);
      }
    };

    const handleReset = () => {
      setFilename("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (onChange) {
        onChange(null);
      }
    };

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="file"
            id={id}
            ref={(node) => {
              // Handle both refs
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              // Removed assignment to inputRef.current because it's read-only
            }}
            className="sr-only"
            accept={accept}
            onChange={handleFileChange}
          />

          <div
            className={`
              flex items-center justify-between px-3 py-2 border rounded-md shadow-sm 
              ${error ? "border-red-500" : "border-gray-300"}
              ${filename ? "bg-gray-50" : "bg-white"}
            `}
          >
            <div className="flex items-center flex-1 min-w-0">
              {filename ? (
                <>
                  <FileText className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate">
                    {filename}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  Choose a file or drag and drop here
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              {filename && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 rounded-md hover:bg-gray-200 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <label
                htmlFor={id}
                className="cursor-pointer p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Upload className="w-4 h-4" />
              </label>
            </div>
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export default FileInput;
