import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TooltipIcon from './TooltipIcon';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  showPlaceholderAsTooltip?: boolean;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  showPlaceholderAsTooltip = false,
  readOnly = false
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent'
  ];

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-700">
          <span>{label}</span>
          {showPlaceholderAsTooltip && placeholder && (
            <TooltipIcon content={placeholder} />
          )}
        </label>
      )}
      <div className={`
        ${error ? 'border-red-300' : 'border-gray-300'}
        rounded-md quill-editor-wrapper ${readOnly ? 'read-only' : ''}
      `}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;