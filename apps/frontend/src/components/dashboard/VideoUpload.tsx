import React, { useContext, useState } from "react";
import { Upload, Video, Play, Trash } from "lucide-react";
import { uploadVideo } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { VideoContext } from "@/context/VideoContext";

export const VideoUpload: React.FC = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const video = useContext(VideoContext);

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
    const files = Array.from(e.dataTransfer.files);
    setFile(files[0]);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFile(files[0]);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    console.log("Uploading files:", files);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsProcessing(false);
  };

  const handleProcessVideo = async () => {
    setIsProcessing(true);
    if(!file) return
    const data = await uploadVideo(file, user?.id as string, file.name as string, file.name);
    if (data.success === true) {
      setIsProcessing(false);
      await video?.refreshVideos()
      setFile(null);
    }
  };

  return (
    <div className="space-y-4">
      {file ? (
        <div className="border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleProcessVideo}
              disabled={isProcessing}
              className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Process Video
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Video className="w-12 h-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Drag and drop your video here, or click to select
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: MP4, AVI, MOV (max 500MB)
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Upload className="w-4 h-4 mr-2" />
                Select Video
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
