"use client";

import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

export default function LinkGeneratorPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [qrColor, setQrColor] = useState("#0068FF");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If starts with 0, replace with 84
    if (cleaned.startsWith("0")) {
      cleaned = "84" + cleaned.slice(1);
    }

    // If doesn't start with country code, assume Vietnam
    if (!cleaned.startsWith("84")) {
      cleaned = "84" + cleaned;
    }

    return cleaned;
  };

  const generateZaloLink = () => {
    if (!phoneNumber) return "";

    const formattedPhone = formatPhoneNumber(phoneNumber);
    let link = `https://zalo.me/${formattedPhone}`;

    if (message) {
      link += `?text=${encodeURIComponent(message)}`;
    }

    return link;
  };

  const zaloLink = generateZaloLink();

  const copyToClipboard = async () => {
    if (!zaloLink) return;

    try {
      await navigator.clipboard.writeText(zaloLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (!qrRef.current) return;

    if (format === "svg") {
      const svg = qrRef.current.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `zalo-qr-${formatPhoneNumber(phoneNumber)}.svg`;
      a.click();

      URL.revokeObjectURL(url);
    } else {
      const canvas = qrRef.current.querySelector("canvas");
      if (!canvas) return;

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `zalo-qr-${formatPhoneNumber(phoneNumber)}.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tạo Link Zalo
          </h1>
          <p className="text-lg text-gray-600">
            Tạo link Click-to-Chat và QR code để khách hàng dễ dàng liên hệ với
            bạn qua Zalo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin
            </h2>

            <div className="space-y-6">
              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912345678 hoặc 84912345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Nhập số điện thoại Việt Nam (có hoặc không có mã quốc gia)
                </p>
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tin nhắn mặc định (tùy chọn)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Xin chào! Tôi muốn biết thêm về..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Tin nhắn sẽ được điền sẵn khi khách hàng mở link
                </p>
              </div>

              {/* QR Customization */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="qrColor"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Màu QR Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="qrColor"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bgColor"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Màu nền
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="bgColor"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Kết quả
            </h2>

            {phoneNumber ? (
              <div className="space-y-6">
                {/* Generated Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Zalo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={zaloLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-[#0068FF] text-white hover:bg-[#0052CC]"
                      }`}
                    >
                      {copied ? "Đã sao chép!" : "Sao chép"}
                    </button>
                  </div>
                </div>

                {/* QR Code Preview */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    QR Code
                  </label>
                  <div
                    ref={qrRef}
                    className="inline-block p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <QRCodeSVG
                      value={zaloLink}
                      size={200}
                      fgColor={qrColor}
                      bgColor={bgColor}
                      level="H"
                      className="hidden"
                    />
                    <QRCodeCanvas
                      value={zaloLink}
                      size={200}
                      fgColor={qrColor}
                      bgColor={bgColor}
                      level="H"
                    />
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => downloadQR("png")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Tải PNG
                  </button>
                  <button
                    onClick={() => downloadQR("svg")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Tải SVG
                  </button>
                </div>

                {/* Test Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <a
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#0068FF] hover:underline"
                  >
                    <span>Thử nghiệm link</span>
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p>Nhập số điện thoại để tạo link và QR code</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hướng dẫn sử dụng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E6F0FF] rounded-full flex items-center justify-center text-[#0068FF] font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Nhập số điện thoại
                </h3>
                <p className="text-sm text-gray-600">
                  Nhập số điện thoại Zalo của bạn hoặc doanh nghiệp
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E6F0FF] rounded-full flex items-center justify-center text-[#0068FF] font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Thêm tin nhắn mặc định
                </h3>
                <p className="text-sm text-gray-600">
                  Tùy chọn: thêm tin nhắn được điền sẵn cho khách hàng
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#E6F0FF] rounded-full flex items-center justify-center text-[#0068FF] font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Chia sẻ link/QR</h3>
                <p className="text-sm text-gray-600">
                  Sao chép link hoặc tải QR code để chia sẻ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
