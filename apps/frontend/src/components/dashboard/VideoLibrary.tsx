import { useContext, useEffect, useState, useRef } from "react";
import {
  Calendar,
  ExternalLink,
  Video,
  Info,
  X,
  FileVideo,
  List,
} from "lucide-react";
import { VideoContext } from "@/context/VideoContext";
import { Video as VideoType } from "@repo/types";
import Hls from "hls.js";

const VideoLibraryTable = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const videoContext = useContext(VideoContext);
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [playbackType, setPlaybackType] = useState<"mp4" | "hls">("mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (videoContext?.userVideos?.videos) {
      setVideos(videoContext.userVideos.videos);
    }
  }, [videoContext?.userVideos]);

  // Set up or destroy HLS instance when video source or playback type changes
  useEffect(() => {
    if (!modalOpen || !currentVideo) return;

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Set up HLS if needed
    if (
      playbackType === "hls" &&
      videoRef.current &&
      currentVideo.shareableLink?.includes(".m3u8")
    ) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });
        hls.loadSource(currentVideo.shareableLink);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            videoRef.current.play().catch((error) => {
              console.error("Error auto-playing video:", error);
            });
          }
        });
        hlsRef.current = hls;
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // For Safari which has native HLS support
        videoRef.current.src = currentVideo.shareableLink;
        videoRef.current.addEventListener("loadedmetadata", function () {
          videoRef.current?.play().catch((error) => {
            console.error("Error auto-playing video:", error);
          });
        });
      }
    }

    // Clean up HLS on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [modalOpen, currentVideo, playbackType]);

  if (!videoContext) {
    return <div>Loading video context...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const openVideoModal = (video: VideoType) => {
    setCurrentVideo(video);

    // If the video has an HLS stream and no MP4, default to HLS
    if (video.shareableLink?.includes(".m3u8") && !video.rawVideoUrl) {
      setPlaybackType("hls");
    } else {
      setPlaybackType("mp4"); // Default to MP4 otherwise
    }

    setModalOpen(true);
  };

  const openDetailsModal = (video: VideoType) => {
    setCurrentVideo(video);
    setDetailsModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVideo(null);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  const openInNewWindow = (videoUrl: string) => {
    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PROCESSED":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const hasHlsStream = (video: VideoType) => {
    return video.shareableLink?.includes(".m3u8");
  };

  const hasRawVideo = (video: VideoType) => {
    return !!video.rawVideoUrl;
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
                    className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(video.status)}`}
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
                      disabled={!hasRawVideo(video) && !hasHlsStream(video)}
                    >
                      <Video className="w-4 h-4" /> Play
                    </button>
                    {hasRawVideo(video) && (
                      <button
                        onClick={() => openInNewWindow(video.rawVideoUrl)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-300"
                      >
                        <ExternalLink className="w-4 h-4" /> Open
                      </button>
                    )}
                    <button
                      onClick={() => openDetailsModal(video)}
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

      {/* Video Player Modal */}
      {modalOpen && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">{currentVideo.name}</h3>
              <div className="flex items-center gap-3">
                {/* Only show format toggle when both formats are available */}
                {hasRawVideo(currentVideo) && hasHlsStream(currentVideo) && (
                  <div className="flex border rounded overflow-hidden text-sm">
                    <button
                      onClick={() => setPlaybackType("mp4")}
                      className={`px-3 py-1 flex items-center gap-1 ${
                        playbackType === "mp4"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-50"
                      }`}
                    >
                      <FileVideo className="w-4 h-4" /> MP4
                    </button>
                    <button
                      onClick={() => setPlaybackType("hls")}
                      className={`px-3 py-1 flex items-center gap-1 ${
                        playbackType === "hls"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-50"
                      }`}
                    >
                      <List className="w-4 h-4" /> HLS
                    </button>
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-black">
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full max-h-96 mx-auto"
                src={
                  playbackType === "mp4" ? currentVideo.rawVideoUrl : undefined
                }
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600">
                {currentVideo.description || "No description"}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Uploaded: {formatDate(currentVideo.uploadedAt)}
                {currentVideo.status === "COMPLETED" && (
                  <span className="ml-4 px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                    {playbackType === "mp4"
                      ? "Playing MP4"
                      : "Playing HLS Stream"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Details Modal */}
      {detailsModalOpen && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">Video Details</h3>
              <button
                onClick={closeDetailsModal}
                className="p-1 cursor-pointer hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Name</h4>
                  <p className="text-gray-600">{currentVideo.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Description
                  </h4>
                  <p className="text-gray-600">
                    {currentVideo.description || "No description"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <span
                    className={`px-2 py-1 inline-block rounded-full text-xs ${getStatusStyles(currentVideo.status)}`}
                  >
                    {currentVideo.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Uploaded At
                  </h4>
                  <p className="text-gray-600">
                    {formatDate(currentVideo.uploadedAt)}
                  </p>
                </div>

                {currentVideo.processedAt && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Processed At
                    </h4>
                    <p className="text-gray-600">
                      {formatDate(currentVideo.processedAt)}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Video ID
                  </h4>
                  <p className="text-gray-600 font-mono text-xs break-all">
                    {currentVideo.id}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">User ID</h4>
                  <p className="text-gray-600 font-mono text-xs break-all">
                    {currentVideo.userId}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Available Formats
                  </h4>
                  <div className="space-y-2 mt-1">
                    {hasRawVideo(currentVideo) ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            MP4
                          </span>
                          <span className="text-green-600 text-xs">
                            Available
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs break-all pl-2">
                          {currentVideo.rawVideoUrl}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          MP4
                        </span>
                        <span className="text-gray-500 text-xs">
                          Not available
                        </span>
                      </div>
                    )}

                    {hasHlsStream(currentVideo) ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            HLS
                          </span>
                          <span className="text-green-600 text-xs">
                            Available
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs break-all pl-2">
                          {currentVideo.shareableLink}
                        </p>
                      </div>
                    ) : currentVideo.shareableLink &&
                      !hasHlsStream(currentVideo) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          Share ID
                        </span>
                        <span className="text-gray-600 text-xs">
                          {currentVideo.shareableLink}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          HLS
                        </span>
                        <span className="text-gray-500 text-xs">
                          Not available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
              {hasRawVideo(currentVideo) && (
                <button
                  onClick={() => {
                    setPlaybackType("mp4");
                    openVideoModal(currentVideo);
                    closeDetailsModal();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700"
                >
                  <FileVideo className="w-4 h-4" /> Play MP4
                </button>
              )}
              {hasHlsStream(currentVideo) && (
                <button
                  onClick={() => {
                    setPlaybackType("hls");
                    openVideoModal(currentVideo);
                    closeDetailsModal();
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1 hover:bg-green-700"
                >
                  <List className="w-4 h-4" /> Play HLS
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibraryTable;
