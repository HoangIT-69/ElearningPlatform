const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-white py-16 px-4 md:py-24 md:px-8 text-center border-b border-red-200">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-40 h-40 md:w-80 md:h-80 bg-red-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-red-200 rounded-full blur-3xl opacity-50"></div> 
      </div>
      <div className="relative max-w-4xl mx-auto space-y-6 md:space-y-8 ">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
          Nâng cao kỹ năng của bạn
          <span className="block bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            cùng Thăng Long University
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          Học từ những giáo viên hàng đầu với hàng trăm khóa học chất lượng cao.
          Bắt đầu hành trình học tập của bạn ngay hôm nay.
        </p>
      </div>
    </div>
  );
};
export default HeroSection;
