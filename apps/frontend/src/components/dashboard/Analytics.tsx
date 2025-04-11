import React, { useContext } from 'react';
import { Video, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { VideoContext } from '@/context/VideoContext';


export const Analytics: React.FC = () => {
  const userVideo = useContext(VideoContext);
  const stats = [
    {
      name: 'Total Videos',
      value: userVideo?.userVideos?.userVideos.totalVideos || '0',
      icon: Video,
      color: 'text-blue-500',
    },
    {
      name: 'Processing',
      value: userVideo?.userVideos?.userVideos.processing || '0',
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      name: 'Completed',
      value: userVideo?.userVideos?.userVideos.completed || '0',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      name: 'Failed',
      value: userVideo?.userVideos?.userVideos.failed || '0',
      icon: AlertCircle,
      color: 'text-red-500',
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${stat.color} bg-opacity-10`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </dd>
        </div>
      ))}
    </div>
  );
};