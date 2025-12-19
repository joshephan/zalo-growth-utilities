"use client";

import { useState, useMemo } from "react";

type TemplateType = "text" | "image_text" | "button";

interface Variable {
  name: string;
  value: string;
}

const MAX_CHARS = 2000;

const defaultVariables: Variable[] = [
  { name: "name", value: "Nguyễn Văn A" },
  { name: "order_id", value: "DH123456" },
  { name: "amount", value: "1,500,000" },
  { name: "date", value: "20/12/2024" },
];

const sampleTemplates = {
  text: `Xin chào {{name}}!

Đơn hàng {{order_id}} của bạn đã được xác nhận.

Tổng giá trị: {{amount}} VND
Ngày đặt hàng: {{date}}

Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!`,
  image_text: `Chào {{name}}!

Khuyến mãi đặc biệt dành cho bạn!
Giảm ngay 20% cho đơn hàng tiếp theo.

Mã giảm giá: ZALO20
Hạn sử dụng: {{date}}`,
  button: `Xin chào {{name}}!

Đơn hàng {{order_id}} đang được vận chuyển.

Dự kiến giao hàng: {{date}}

Vui lòng bấm nút bên dưới để theo dõi đơn hàng.`,
};

export default function ZNSPreviewerPage() {
  const [templateType, setTemplateType] = useState<TemplateType>("text");
  const [templateContent, setTemplateContent] = useState(sampleTemplates.text);
  const [variables, setVariables] = useState<Variable[]>(defaultVariables);
  const [businessName, setBusinessName] = useState("Doanh nghiệp ABC");
  const [buttonText, setButtonText] = useState("Theo dõi đơn hàng");
  const [imageUrl, setImageUrl] = useState("");

  const charCount = templateContent.length;
  const isOverLimit = charCount > MAX_CHARS;

  const processedContent = useMemo(() => {
    let content = templateContent;
    variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable.name}}}`, "g");
      content = content.replace(regex, variable.value);
    });
    return content;
  }, [templateContent, variables]);

  const handleTemplateTypeChange = (type: TemplateType) => {
    setTemplateType(type);
    setTemplateContent(sampleTemplates[type]);
  };

  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }]);
  };

  const updateVariable = (
    index: number,
    field: "name" | "value",
    newValue: string
  ) => {
    const updated = [...variables];
    updated[index][field] = newValue;
    setVariables(updated);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const extractVariables = () => {
    const matches = templateContent.match(/{{(\w+)}}/g) || [];
    const varNames = matches.map((m) => m.replace(/{{|}}/g, ""));
    const uniqueVars = [...new Set(varNames)];

    const newVariables = uniqueVars.map((name) => {
      const existing = variables.find((v) => v.name === name);
      return existing || { name, value: "" };
    });

    setVariables(newVariables);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ZNS Template Preview
          </h1>
          <p className="text-lg text-gray-600">
            Xem trước mẫu tin nhắn ZNS trên giao diện điện thoại di động
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            {/* Template Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Loại mẫu
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: "text" as const, label: "Chỉ văn bản" },
                  { type: "image_text" as const, label: "Hình ảnh + Văn bản" },
                  { type: "button" as const, label: "Văn bản + Nút" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleTemplateTypeChange(item.type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      templateType === item.type
                        ? "bg-[#0068FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin doanh nghiệp
              </h2>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Tên doanh nghiệp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none"
              />
            </div>

            {/* Template Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Nội dung mẫu
                </h2>
                <span
                  className={`text-sm font-medium ${
                    isOverLimit ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                rows={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none resize-none font-mono text-sm ${
                  isOverLimit ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập nội dung mẫu ZNS..."
              />
              {isOverLimit && (
                <p className="mt-2 text-sm text-red-500">
                  Nội dung vượt quá giới hạn {MAX_CHARS} ký tự
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Sử dụng {"{{variable}}"} để thêm biến động
              </p>

              <button
                onClick={extractVariables}
                className="mt-4 px-4 py-2 text-sm text-[#0068FF] hover:bg-[#E6F0FF] rounded-lg transition-colors"
              >
                Tự động nhận diện biến
              </button>
            </div>

            {/* Image URL (for image_text type) */}
            {templateType === "image_text" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Hình ảnh
                </h2>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* Button Text (for button type) */}
            {templateType === "button" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Nút bấm
                </h2>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Văn bản nút"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* Variables */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Biến động
                </h2>
                <button
                  onClick={addVariable}
                  className="px-3 py-1 text-sm text-[#0068FF] hover:bg-[#E6F0FF] rounded-lg transition-colors"
                >
                  + Thêm biến
                </button>
              </div>
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) =>
                        updateVariable(index, "name", e.target.value)
                      }
                      placeholder="Tên biến"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) =>
                        updateVariable(index, "value", e.target.value)
                      }
                      placeholder="Giá trị"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none"
                    />
                    <button
                      onClick={() => removeVariable(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Xem trước
              </h2>

              {/* Phone Frame */}
              <div className="flex justify-center">
                <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[40px] p-3 shadow-xl">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />

                  {/* Screen */}
                  <div className="w-full h-full bg-[#E5E5EA] rounded-[32px] overflow-hidden flex flex-col">
                    {/* Status Bar */}
                    <div className="h-11 bg-[#F2F2F7] flex items-center justify-between px-6 pt-2">
                      <span className="text-xs font-semibold">9:41</span>
                      <div className="flex gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3C6.5 3 2 6.58 2 11c0 2.13 1.05 4.04 2.73 5.43L3 21l4.78-2.49C9.08 18.83 10.51 19 12 19c5.5 0 10-3.58 10-8s-4.5-8-10-8z" />
                        </svg>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 4h-3V2h-4v2H7v18h10V4zm-5 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                        </svg>
                      </div>
                    </div>

                    {/* Chat Header */}
                    <div className="h-12 bg-white flex items-center px-4 gap-3 border-b border-gray-200">
                      <div className="w-8 h-8 bg-[#0068FF] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Z</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                          {businessName}
                        </p>
                        <p className="text-xs text-gray-500">Zalo OA</p>
                      </div>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {/* ZNS Message */}
                        <div className="bg-white rounded-2xl rounded-tl-sm max-w-[240px] shadow-sm overflow-hidden">
                          {/* Image for image_text type */}
                          {templateType === "image_text" && (
                            <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <svg
                                  className="w-12 h-12 text-gray-400"
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
                              )}
                            </div>
                          )}

                          {/* Text Content */}
                          <div className="p-3">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                              {processedContent}
                            </p>
                          </div>

                          {/* Button for button type */}
                          {templateType === "button" && (
                            <div className="px-3 pb-3">
                              <button className="w-full py-2 bg-[#0068FF] text-white text-sm font-medium rounded-lg">
                                {buttonText}
                              </button>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="px-3 pb-2">
                            <p className="text-xs text-gray-400 text-right">
                              09:41
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="h-14 bg-white flex items-center px-4 gap-2 border-t border-gray-200">
                      <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                        <span className="text-sm text-gray-400">Nhập tin nhắn...</span>
                      </div>
                      <div className="w-8 h-8 bg-[#0068FF] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-[#E6F0FF] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lưu ý khi tạo mẫu ZNS
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>Giới hạn nội dung: tối đa {MAX_CHARS} ký tự</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>
                Sử dụng biến động {"{{variable}}"} để cá nhân hóa tin nhắn
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>Tránh sử dụng quá nhiều emoji hoặc ký tự đặc biệt</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0068FF]">•</span>
              <span>
                Kiểm tra kỹ độ dài tin nhắn trên các thiết bị khác nhau
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
