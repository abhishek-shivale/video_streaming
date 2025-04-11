import React from 'react';
import { Analytics } from './Analytics';
import { VideoUpload } from './VideoUpload';
import { useAuth } from '@/hooks/useAuth';
import VideoLibraryTable from './VideoLibrary';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <Analytics />
          </div>
          <div className="py-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload New Video
              </h2>
              <VideoUpload />
            </div>
          </div>
          <div className="py-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Video Library
              </h2>
              <VideoLibraryTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};