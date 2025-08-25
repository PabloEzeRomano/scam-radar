'use client';

import { useT } from '@/lib/translations/TranslationsProvider';
import { FileDropzoneProps } from '@/types';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function FileDropzone({
  onDrop,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  className,
  children,
  showFileList = true,
  selectedFiles = [],
  onRemoveFile,
}: FileDropzoneProps) {
  const t = useT();

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: onDropCallback,
      accept,
      multiple,
      maxSize,
      disabled,
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptText = () => {
    if (!accept) return t('fileDropzone.anyFileType');

    const extensions = Object.values(accept).flat();
    if (extensions.length === 0) return t('fileDropzone.anyFileType');

    return extensions
      .map((ext) => ext.replace('.', ''))
      .join(', ')
      .toUpperCase();
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          {
            'border-blue-400 bg-blue-50': isDragActive && !isDragReject,
            'border-red-400 bg-red-50': isDragReject,
            'border-gray-300 hover:border-gray-400 hover:bg-gray-50':
              !isDragActive && !isDragReject,
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
      >
        <input {...getInputProps()} />
        {children || (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                {t('fileDropzone.clickToUpload')}
              </span>{' '}
              {t('fileDropzone.dragAndDrop')}
            </div>
            <p className="text-xs text-gray-500">
              {getAcceptText()}
              {maxSize &&
                ` ${t('fileDropzone.upTo')} ${formatFileSize(maxSize)}`}
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {showFileList && selectedFiles.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {multiple
              ? `${t('fileDropzone.filesSelected')} (${selectedFiles.length}):`
              : `${t('fileDropzone.fileSelected')}:`}
          </p>
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md"
              >
                <span className="truncate">{file.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                  {onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                      aria-label={t('fileDropzone.removeFile')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
