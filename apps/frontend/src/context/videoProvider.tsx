import { Video, UserVideos, videoState } from "@repo/types";
import { useState, useCallback, useEffect } from "react";
import { VideoContext } from "./VideoContext";
import { axiosInstance } from "@/instance/axios.instance";

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<videoState>({
    videos: [],
    userVideos: {
      completed: 0,
      failed: 0,
      processing: 0,
      totalVideos: 0,
    },
  });

  const getVideos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/video/get-videos");
      if (data.success === true) {
        console.log(data.data);
        const videos = data.data as Video[];
        const res: UserVideos = {
          totalVideos: videos.length || 0,
          processing: videos.filter(
            (vid) => vid.status === "PROCESSING" || vid.status === "UPLOADED"
          ).length,
          completed: videos.filter(
            (vid) => vid.status === "COMPLETED" || vid.status === "PROCESSED"
          ).length,
          failed: videos.filter((vid) => vid.status === "FAILED").length,
        };
        setState((prev) => ({ ...prev, videos: videos, userVideos: res }));
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getVideos();
    }
    fetchData();
  }, [getVideos]);

  const refreshVideos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/video/get-videos");
      if (data.success === true) {
        console.log(data.data);
        const videos = data.data as Video[];
        const res: UserVideos = {
          totalVideos: videos.length || 0,
          processing: videos.filter(
            (vid) => vid.status === "PROCESSING" || vid.status === "UPLOADED"
          ).length,
          completed: videos.filter(
            (vid) => vid.status === "COMPLETED" || vid.status === "PROCESSED"
          ).length,
          failed: videos.filter((vid) => vid.status === "FAILED").length,
        };
        setState((prev) => ({ ...prev, videos: videos, userVideos: res }));
      }
    } catch (error) {
      console.error("Error refreshing videos:", error);
    }
  }, []);

  const contextValue = {
    ...state.userVideos,
    getVideos,
    refreshVideos,
    userVideos: state,
  };

  console.log(state);

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};
