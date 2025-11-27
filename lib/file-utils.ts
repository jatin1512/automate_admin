/**
 * Get the full URL for an uploaded file
 * @param filePath - The relative file path from database (e.g., "uuid/filename.jpg")
 * @returns Full URL to access the file
 */
export function getFileUrl(filePath: string | null | undefined): string {
  if (!filePath) return "/placeholder.svg";

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "");

  const uploadPath = "/uploads";

  const cleanFilePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  return `${backendBaseUrl}${uploadPath}/${cleanFilePath}`;
}

/**
 * Get downloadable URL for a file (forces download)
 * @param filePath - The relative file path from database
 * @param filename - Optional custom filename for download
 * @returns Full URL with download parameter
 */
export function getDownloadUrl(
  filePath: string | null | undefined,
  filename?: string
): string {
  const url = `${process.env.NEXT_PUBLIC_UPLOAD_PATH}${filePath}`;
  if (url === "/placeholder.svg") return url;

  return url;
}
