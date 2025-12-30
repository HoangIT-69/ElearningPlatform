const CTASection = ({ scrollToExplore }) => {
  return (
    <div className="w-full bg-red-100 py-12 md:py-15 flex justify-center px-4">
      <div className="py-12 md:py-20 bg-gradient-to-r from-red-500 to-red-400 text-center text-white rounded-3xl w-full md:w-5/6">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Sẵn sàng bắt đầu?</h2>
          <p className="ext-base md:text-lg text-white/90 mb-8 md:mb-10">
            Tham gia hàng nghìn học viên đang phát triển kỹ năng của họ trên
            Thăng Long University.
          </p>
          <button
            onClick={scrollToExplore}
            className="w-full md:w-auto px-10 py-4 bg-white text-red-500 font-semibold rounded-lg hover:bg-red-100 transition-all shadow-lg hover:shadow-xl"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
