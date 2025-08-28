import { getAuthHeaders } from "./authUtils";

export interface UploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  message?: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  folder: string = "eventpilot"
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const authHeaders = getAuthHeaders();

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        // Don't set Content-Type header - let the browser set it for FormData
        ...Object.fromEntries(
          Object.entries(authHeaders).filter(([key]) => key !== "Content-Type")
        ),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Upload failed");
    }

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check if it's an image
  if (!isImageFile(file)) {
    return { valid: false, error: "Please select an image file" };
  }

  // Check file size (5MB limit)
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
}
