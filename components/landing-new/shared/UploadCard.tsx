import { useState, useRef } from 'react';
import { Upload, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UploadCardProps {
  onUpload?: (file: File) => void;
}

export function UploadCard({ onUpload }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      onUpload?.(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onUpload?.(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-blue-100 p-6 h-full flex flex-col">
      <h3 className="font-semibold text-lg text-text-primary mb-4">
        Upload Your Resume
      </h3>

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[180px] ${
          isDragging
            ? 'border-accent-blue bg-accent-light'
            : 'border-gray-200 hover:border-accent-blue/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <FileText className="w-10 h-10 text-accent-blue mb-2" />
            <span className="text-sm font-medium text-text-primary">{file.name}</span>
            <span className="text-xs text-text-secondary mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-accent-blue" />
            </div>
            <p className="text-sm font-medium text-text-primary text-center">
              Drop your resume here
            </p>
            <p className="text-xs text-text-secondary mt-1 text-center">
              or click to browse
            </p>
          </>
        )}
      </div>

      {/* File types & CTA */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs bg-gray-100">
            <File className="w-3 h-3 mr-1" />
            PDF
          </Badge>
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs bg-gray-100">
            <FileText className="w-3 h-3 mr-1" />
            DOCX
          </Badge>
        </div>

        <Button
          className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-4 py-2 text-sm font-medium btn-hover"
          onClick={() => file && onUpload?.(file)}
          disabled={!file}
        >
          Check Resume
        </Button>
      </div>

      <p className="text-xs text-text-secondary mt-3">
        PDF or DOCX • Max 5MB • Private & encrypted
      </p>
    </div>
  );
}
