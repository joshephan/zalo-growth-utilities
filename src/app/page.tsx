import Link from "next/link";

const tools = [
  {
    title: "Tạo Link Zalo",
    description:
      "Tạo link Click-to-Chat với QR code và tin nhắn được cài đặt sẵn. Hỗ trợ tải QR code PNG/SVG.",
    href: "/link-generator",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    title: "ZNS Template Preview",
    description:
      "Xem trước mẫu tin nhắn ZNS trên giao diện điện thoại. Kiểm tra độ dài và định dạng theo thời gian thực.",
    href: "/zns-previewer",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Tạo Sticker Zalo",
    description:
      "Chuyển đổi hình ảnh sang định dạng sticker Zalo (360x360px). Hỗ trợ xử lý hàng loạt và tải xuống ZIP.",
    href: "/sticker-maker",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0068FF] to-[#0052CC] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Zalo Growth Utilities
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Bộ công cụ tự động hóa marketing Zalo dành cho doanh nghiệp vừa và
            nhỏ tại Việt Nam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/link-generator"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0068FF] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Bắt đầu ngay
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Xem các công cụ
            </a>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Công cụ Marketing Zalo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Các công cụ miễn phí giúp bạn tối ưu hóa hoạt động marketing trên
              Zalo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#0068FF] transition-all group"
              >
                <div className="w-14 h-14 bg-[#E6F0FF] rounded-lg flex items-center justify-center text-[#0068FF] mb-4 group-hover:bg-[#0068FF] group-hover:text-white transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn Zalo Growth Utilities?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Miễn phí 100%",
                description: "Tất cả công cụ đều miễn phí, không giới hạn",
              },
              {
                title: "Không cần đăng ký",
                description: "Sử dụng ngay mà không cần tạo tài khoản",
              },
              {
                title: "Bảo mật",
                description: "Xử lý hoàn toàn trên trình duyệt của bạn",
              },
              {
                title: "Dễ sử dụng",
                description: "Giao diện đơn giản, thân thiện người dùng",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-lg bg-gray-50"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
