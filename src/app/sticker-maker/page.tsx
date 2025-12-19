"use client";

import { useState, useCallback, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ProcessedImage {
  id: string;
  originalName: string;
  originalUrl: string;
  processedUrl: string;
  size: { width: number; height: number };
}

const STICKER_SIZE = 360;

export default function StickerMakerPage() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(
    (file: File): Promise<ProcessedImage> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = STICKER_SIZE;
            canvas.height = STICKER_SIZE;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(new Error("Cannot get canvas context"));
              return;
            }

            // Calculate scaling to fit the image in the square while maintaining aspect ratio
            const scale = Math.min(
              STICKER_SIZE / img.width,
              STICKER_SIZE / img.height
            );
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (STICKER_SIZE - scaledWidth) / 2;
            const y = (STICKER_SIZE - scaledHeight) / 2;

            // Clear canvas (transparent background)
            ctx.clearRect(0, 0, STICKER_SIZE, STICKER_SIZE);

            // Draw the image centered
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

            const processedUrl = canvas.toDataURL("image/png");

            resolve({
              id: crypto.randomUUID(),
              originalName: file.name,
              originalUrl: e.target?.result as string,
              processedUrl,
              size: { width: img.width, height: img.height },
            });
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setProcessing(true);
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      try {
        const processed = await Promise.all(validFiles.map(processImage));
        setImages((prev) => [...prev, ...processed]);
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        setProcessing(false);
      }
    },
    [processImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const downloadSingle = (image: ProcessedImage) => {
    const link = document.createElement("a");
    link.href = image.processedUrl;
    link.download = `sticker-${image.originalName.replace(/\.[^/.]+$/, "")}.png`;
    link.click();
  };

  const downloadAll = async () => {
    if (images.length === 0) return;

    if (images.length === 1) {
      downloadSingle(images[0]);
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("zalo-stickers");

    if (!folder) return;

    images.forEach((image, index) => {
      const base64Data = image.processedUrl.split(",")[1];
      const fileName = `sticker-${index + 1}-${image.originalName.replace(/\.[^/.]+$/, "")}.png`;
      folder.file(fileName, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "zalo-stickers.zip");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tạo Sticker Zalo
          </h1>
          <p className="text-lg text-gray-600">
            Chuyển đổi hình ảnh sang định dạng sticker Zalo ({STICKER_SIZE}x
            {STICKER_SIZE}px)
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`bg-white rounded-xl p-8 shadow-sm border-2 border-dashed transition-colors ${
            dragActive
              ? "border-[#0068FF] bg-[#E6F0FF]"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-2">
              Kéo thả hình ảnh vào đây
            </p>
            <p className="text-sm text-gray-500 mb-4">hoặc</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-[#0068FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors"
            >
              Chọn hình ảnh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-4">
              Hỗ trợ PNG, JPG, GIF, WebP. Có thể chọn nhiều hình cùng lúc.
            </p>
          </div>
        </div>

        {/* Processing Indicator */}
        {processing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0068FF] rounded-lg">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Đang xử lý...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Kết quả ({images.length} sticker)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-[#0068FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors"
                >
                  {images.length === 1 ? "Tải xuống" : "Tải tất cả (ZIP)"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 group"
                >
                  {/* Preview */}
                  <div className="relative aspect-square bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg overflow-hidden mb-3">
                    <img
                      src={image.processedUrl}
                      alt={image.originalName}
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <p
                      className="text-xs text-gray-600 truncate"
                      title={image.originalName}
                    >
                      {image.originalName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {image.size.width}x{image.size.height} → {STICKER_SIZE}x
                      {STICKER_SIZE}
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadSingle(image)}
                    className="w-full mt-3 py-2 text-sm text-[#0068FF] hover:bg-[#E6F0FF] rounded-lg transition-colors"
                  >
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specs */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông số kỹ thuật Sticker Zalo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center text-[#0068FF] flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Kích thước</h3>
                <p className="text-sm text-gray-600">
                  {STICKER_SIZE}x{STICKER_SIZE} pixels
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center text-[#0068FF] flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Định dạng</h3>
                <p className="text-sm text-gray-600">PNG với nền trong suốt</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center text-[#0068FF] flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Tối ưu</h3>
                <p className="text-sm text-gray-600">
                  Tự động căn giữa và scale
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-[#E6F0FF] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Mẹo tạo sticker đẹp
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>Sử dụng hình ảnh có nền trong suốt để sticker đẹp hơn</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>Chọn hình ảnh vuông để tránh bị cắt xén</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>
                Hình ảnh nên có độ phân giải tối thiểu {STICKER_SIZE}x
                {STICKER_SIZE}px
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>Tránh hình ảnh có chi tiết quá nhỏ vì sẽ khó nhìn trên sticker</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
