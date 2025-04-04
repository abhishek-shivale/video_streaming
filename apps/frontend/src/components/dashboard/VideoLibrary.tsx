import { useContext, useEffect, useState } from "react";
import { Calendar, ExternalLink, Video, Info, X } from "lucide-react";
import { VideoContext } from "@/context/VideoContext";
import { Video as VideoType } from "@repo/types";

const VideoLibraryTable = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const videoContext = useContext(VideoContext);
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (videoContext?.userVideos?.videos) {
      setVideos(videoContext.userVideos.videos);
    }
  }, [videoContext?.userVideos]);

  if (!videoContext) {
    return <div>Loading video context...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const openVideoModal = (video: VideoType) => {
    setCurrentVideo(video);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVideo(null);
  };

  const openInNewWindow = (videoUrl: string) => {
    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Uploaded</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{video.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      video.status === "PROCESSED" ||
                      video.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : video.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {video.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(video.uploadedAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openVideoModal(video)}
                      className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700"
                    >
                      <Video className="w-4 h-4" /> Play
                    </button>
                    <button
                      onClick={() => openInNewWindow(video.rawVideoUrl)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-300"
                    >
                      <ExternalLink className="w-4 h-4" /> Open
                    </button>
                    <button
                      onClick={() => {}}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-300"
                    >
                      <Info className="w-4 h-4" /> Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">{currentVideo.name}</h3>
              <button
                onClick={closeModal}
                className="p-1 cursor-pointer hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {currentVideo.rawVideoUrl ? (
                <video
                  controls
                  className="w-full max-h-96"
                  src={currentVideo.rawVideoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500">
                  No video available
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600">
                {currentVideo.description}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Uploaded: {formatDate(currentVideo.uploadedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibraryTable;
