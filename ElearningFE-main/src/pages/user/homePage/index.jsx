import React, { memo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Scrollbar, Autoplay } from "swiper/modules";
import PopularCourse from "../../../components/PopularCourse";
import HeroSection from "../../../components/HeroSection";
import StatsSection from "../../../components/StatsSection";
import CTASection from "../../../components/CTASection";
import Course from "../../../components/Course";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as courseService from "../../../service/courseService";
import { useNavigate } from "react-router-dom";
import TeachersSection from "../../../components/TeachersSection";
import TestimonialsSection from "../../../components/TestimonialsSection";
import FAQSection from "../../../components/FAQSection";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9);
  const navigate = useNavigate();
  const exploreRef = useRef(null);
  const fetechCourses = async (page, size) => {
    const data = await courseService.getAllCourses(page, size);
    return data;
  };

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetechCourses,
  });

  const fetchPopularCourses = async () => {
    return await courseService.getPopularCourses(8);
  };

  const { data: popularCourses = [] } = useQuery({
    queryKey: ["popularCourses"],
    queryFn: fetchPopularCourses,
  });

  if (isLoading) {
    return <p className="text-center py-10">Đang tải khóa học...</p>;
  }

  return (
    <div>
      <HeroSection />
      <StatsSection />
      <div className="relative overflow-hidden bg-gradient-to-br from-red-100 via-white to-white py-24 px-8 md:py-24 md:px-8 border-b border-red-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl md:text-5xl font-bold text-red-500 mb-6">
            Những gì bạn sẽ đạt được
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed text-base md:text-lg">
            Sau khi hoàn thành các khóa học, bạn sẽ tự tin hơn với kỹ năng, tư
            duy và kiến thức vững chắc để chinh phục mục tiêu nghề nghiệp.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {[
              {
                title: "Nâng cao kỹ năng",
                desc: "Hiểu sâu hơn về chuyên môn và bắt kịp xu hướng mới nhất.",
              },
              {
                title: "Phát triển sự nghiệp",
                desc: "Trang bị nền tảng để thăng tiến và chinh phục công việc mơ ước.",
              },
              {
                title: "Chứng chỉ uy tín",
                desc: "Xác nhận năng lực học viên với chứng chỉ được công nhận.",
              },
              {
                title: "Mở rộng mối quan hệ",
                desc: "Gặp gỡ và học hỏi từ cộng đồng học viên và chuyên gia.",
              },
              {
                title: "Ứng dụng thực tế",
                desc: "Áp dụng kiến thức ngay vào dự án và công việc hằng ngày.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between h-full bg-white border border-red-100  rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 text-center"
              >
                <h3 className="font-semibold text-lg text-red-500 mb-3 group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={exploreRef}
        className="py-12 md:py-15 border-b border-red-200 px-4 md:px-0"
      >
        <div className="max-w-7xl mx-auto ">
          <div className="flex flex-col md:flex-row justify-between">
            {" "}
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Các khóa học phổ biến
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                Cập nhật các khóa học được quan tâm nhất, giúp bạn nhanh chóng
                nâng cao kỹ năng và phát triển sự nghiệp trong thời đại số.
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <Swiper
              spaceBetween={16}
              breakpoints={{
                430: { slidesPerView: 1.2 },
                1024: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              modules={[Scrollbar, Autoplay]}
              className="mySwiper !pb-10"
            >
              {popularCourses.map((course) => (
                <SwiperSlide key={course.id} className="p-2">
                  <PopularCourse course={course} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="flex justify-center mt-8 md:mt-12">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg text-base md:text-lg font-semibold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-700 transition-all duration-300"
          >
            Khám phá các khóa học
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <TeachersSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection
        scrollToExplore={() =>
          exploreRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
    </div>
  );
};

export default memo(HomePage);
