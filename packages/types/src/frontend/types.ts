export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
export interface Video {
  id: string;
  name: string;
  description: string;
  rawVideoUrl: string;
  thumbnailUrl: string | null;
  shareableLink: string;
  duration: number | null;
  status: "UPLOADED" | "PROCESSING" | "PROCESSED" | "COMPLETED" | "FAILED";
  uploadedAt: string;
  processedAt: string | null;
  userId: string;
}

export interface UserVideos {
  totalVideos: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface videoState {
  videos: Video[];
  userVideos: UserVideos;
}

export interface VideoContextType extends UserVideos {
  getVideos: () => Promise<void>;
  refreshVideos: () => Promise<void>;
  userVideos: videoState;
}
