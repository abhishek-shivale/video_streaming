import { VideoContextType } from "@repo/types";
import { createContext } from "react";

export const VideoContext = createContext<VideoContextType | undefined>(undefined);