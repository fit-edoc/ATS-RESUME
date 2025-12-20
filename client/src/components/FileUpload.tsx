'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
    onUpload: (file: File) => void;
    isLoading?: boolean;
}

const FileUpload = ({ onUpload, isLoading }: FileUploadProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'text/plain': ['.txt'],
        },
        multiple: false,
        disabled: isLoading,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-800 rounded-full">
                    {isLoading ? (
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8 text-indigo-400" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">
                        {isLoading ? 'Processing Resume...' : 'Drop your resume here'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Supports PDF, DOC, DOCX (Max 10MB)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
