import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface AudioFileUploadProps {
    onFileUpload: (file: File) => Promise<void>;
}

const AudioFileUpload: React.FC<AudioFileUploadProps> = ({ onFileUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4'];

    const validateFile = (file: File): boolean => {
        if (!file) return false;
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Please upload an MP3, WAV, or MP4 file');
            return false;
        }
        return true;
    };

    const handleUpload = async (file: File) => {
        try {
            setIsProcessing(true);
            await onFileUpload(file);
            setIsProcessing(false);
        } catch (error) {
            setError('Error processing file');
            setIsProcessing(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('bg-blue-50');
        }
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('bg-blue-50');
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setError('');

        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('bg-blue-50');
        }

        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile);
            handleUpload(droppedFile);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6">
            <div
                ref={dropZoneRef}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-lg text-gray-600">
                    Drag and drop your audio file here, or
                    <label className="mx-2 text-blue-500 hover:text-blue-600 cursor-pointer">
                        browse
                        <input
                            type="file"
                            className="hidden"
                            accept=".mp3,.wav,.mp4"
                            onChange={handleFileSelect}
                        />
                    </label>
                </p>

                {error && (
                    <p className="mt-4 text-red-500">{error}</p>
                )}

                {isProcessing && (
                    <p className="mt-4 text-blue-500">Processing your file...</p>
                )}

                {file && !isProcessing && (
                    <p className="mt-4 text-green-500">
                        File ready: {file.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AudioFileUpload;