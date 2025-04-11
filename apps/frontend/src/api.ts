import { axiosInstance } from "./instance/axios.instance";

export const uploadVideo = async (file: File, userId: string, name: string, description: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("name", name);
  formData.append("description", description);
  const { data } = await axiosInstance.post("/video", formData);
  return data;
};
