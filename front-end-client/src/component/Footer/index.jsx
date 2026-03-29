import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/z6838744741305_a9a0407315b3348d84d18b1d941ee3ad.jpg"
                alt="Logo Toc tien"
                className="h-12 w-auto mr-3 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              />
              <div>
                <div className="text-lg font-bold text-blue-400">CÔNG TY TNHH CẤP NƯỚC TÓC TIÊN</div>
                <div className="text-sm text-red-400">Nước Sạch Cho Mọi Nhà</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              CÔNG TY TNHH CẤP NƯỚC TÓC TIÊN - Đơn vị cung cấp nước sạch hàng đầu. Chúng tôi cam kết mang đến dịch vụ cấp nước an toàn, liên tục và chất lượng cho cộng đồng.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/tanhoawater" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@tanhoawater" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.425 3.5 12 3.5 12 3.5s-7.425 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.153 0 12 0 12s0 3.847.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.575 20.5 12 20.5 12 20.5s7.425 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.847 24 12 24 12s0-3.847-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="mailto:info@tanhoawater.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm-16 12V8.99l7.99 6.99c.39.34.99.34 1.38 0L20 8.99V18H4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li><a href="/tin-tuc" className="text-gray-300 hover:text-white transition-colors duration-300">Tin tức</a></li>
              <li><a href="/thong-bao" className="text-gray-300 hover:text-white transition-colors duration-300">Thông báo</a></li>
              <li><a href="/dich-vu" className="text-gray-300 hover:text-white transition-colors duration-300">Dịch vụ</a></li>
              <li><a href="/tra-cuu" className="text-gray-300 hover:text-white transition-colors duration-300">Tra cứu</a></li>
              <li><a href="/lien-he" className="text-gray-300 hover:text-white transition-colors duration-300">Liên hệ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Điện thoại: <a href="tel:0865379119" className="text-blue-400 hover:underline"> 0865379119</a></span>
              </li>
              <li>
                <span className="text-gray-300">Email: <a href="mailto:office@toctienltd.vn" className="text-blue-400 hover:underline">office@toctienltd.vn</a></span>
              </li>
              <li>
                <span className="text-gray-300">Địa chỉ: Ấp 6, Xã Châu Pha, TP Hồ Chí Minh</span>
              </li>
              <li>
                <span className="text-gray-300">MST: 3500815711</span>
              </li>
              {/* <li>
                <a href="/chinh-sach" className="text-gray-300 hover:text-white transition-colors duration-300">Chính sách</a>
              </li>
              <li>
                <a href="/dieu-khoan" className="text-gray-300 hover:text-white transition-colors duration-300">Điều khoản</a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} CÔNG TY TNHH CẤP NƯỚC TÓC TIÊN.
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              Thiết kế & phát triển bởi <span className="text-blue-400">Đội ngũ Tóc Tiên</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
