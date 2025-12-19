import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0068FF] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Zalo Growth Utilities
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Bộ công cụ tự động hóa marketing Zalo dành cho doanh nghiệp vừa và
              nhỏ tại Việt Nam.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Công cụ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/link-generator"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  Tạo Link Zalo
                </Link>
              </li>
              <li>
                <Link
                  href="/zns-previewer"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  ZNS Template Preview
                </Link>
              </li>
              <li>
                <Link
                  href="/sticker-maker"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  Tạo Sticker Zalo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  Zalo Official
                </a>
              </li>
              <li>
                <a
                  href="https://oa.zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  Zalo Official Account
                </a>
              </li>
              <li>
                <a
                  href="https://zns.zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#0068FF]"
                >
                  Zalo ZNS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Zalo Growth Utilities. Không liên
            kết với VNG Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
