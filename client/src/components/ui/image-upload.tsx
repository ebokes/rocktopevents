import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Link, Image as ImageIcon } from "lucide-react";
import {
  uploadImage,
  validateImageFile,
  getImagePreviewUrl,
} from "@/lib/uploadUtils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "eventpilot",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    // Show preview immediately
    const preview = getImagePreviewUrl(file);
    setPreviewUrl(preview);

    setIsUploading(true);

    try {
      const result = await uploadImage(file, folder);

      if (result.success && result.url) {
        onChange(result.url);
        setPreviewUrl(null); // Clear preview since we have the real URL
      } else {
        setUploadError(result.message || "Upload failed");
        setPreviewUrl(null);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const clearImage = () => {
    onChange("");
    setPreviewUrl(null);
    setUploadError(null);
  };

  const displayUrl = value || previewUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      <FormLabel>{label}</FormLabel>

      {/* Image Preview */}
      {displayUrl && (
        <div className="relative inline-block">
          <img
            src={displayUrl}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={inputMode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("upload")}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
        <Button
          type="button"
          variant={inputMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("url")}
        >
          <Link className="h-4 w-4 mr-1" />
          URL
        </Button>
      </div>

      {/* Upload Mode */}
      {inputMode === "upload" && (
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
          )}
        </div>
      )}

      {/* URL Mode */}
      {inputMode === "url" && (
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value || ""}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      )}

      {/* Error Display */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {inputMode === "upload"
          ? "Upload an image file (max 1MB). Supported formats: JPG, PNG, GIF, WebP"
          : "Enter a direct URL to an image file"}
      </p>
    </div>
  );
}
