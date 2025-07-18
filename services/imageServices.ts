import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from "axios";
const CLOUDINARY_CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloud = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (typeof file === "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.uri.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await axios.post(CLOUDINARY_CLOUD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = response?.data?.secure_url || response?.data?.url;
      if (!url) {
        throw new Error("Image URL not found in Cloudinary response.");
      }

      return { success: true, data: url };
    }

    return { success: true }; // No file provided, but not an error
  } catch (error: any) {
    console.log("Error uploading the file", error);
    return { success: false, msg: error?.message || "Could not upload file" };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;
  return require("../assets/images/defaultAvatar.png");
};
