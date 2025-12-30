import CourseModules from "../../../components/CourseModules";
import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  CheckCircle,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseService from "../../../service/courseService";
import * as cartService from "../../../service/cartService";
import { toast } from "react-toastify";
import * as reviewService from "../../../service/reviewService";
import * as paymentService from "../../../service/paymentService";
import { formatDate } from "../../../utils/formatterDate";
import { getToken } from "../../../utils/getToken";

const DetailCourse = () => {
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const queryClient = useQueryClient();
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  const fetchReview = async () => {
    const data = await reviewService.getReviewsByCourseId(id);
    return data;
  };

  const { data: reviewsData } = useQuery({
    queryKey: ["courseReviews", id],
    queryFn: fetchReview,
  });

  const reviews = reviewsData?.data || [];

  const mutationReview = useMutation({
    mutationFn: (data) => reviewService.createReview(data),
    onSuccess: () => {
      toast.success("Cảm ơn bạn đã đánh giá!");
      setUserComment("");
      setUserRating(5);
      queryClient.invalidateQueries(["courseReviews", id]);
      queryClient.invalidateQueries(["courseDetail", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    },
  });

  const handlePostReview = () => {
    if (!userComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá!");
      return;
    }
    mutationReview.mutate({
      courseId: id,
      rating: userRating,
      comment: userComment,
    });
  };

  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) {
      toast.info("Vui lòng đăng nhập để thực hiện chức năng này");
      navigate("/login");
      return;
    }
    try {
      const res = await cartService.addCourseToCart(id);
      if (res.success === true) {
        toast.success(res.message || "Đã thêm vào giỏ hàng");
      }
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  const fetchCourseDetail = async () => {
    const data = await courseService.getCourseById(id);
    return data;
  };

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["courseDetail", id],
    queryFn: fetchCourseDetail,
  });

  if (isLoading) {
    return (
      <p className="text-center py-10 min-h-screen">
        Đang tải chi tiết khóa học...
      </p>
    );
  }

  if (!courseDetail) {
    return <p className="text-center py-10">Khóa học không tồn tại.</p>;
  }

  const isEnrolledStrict = Boolean(courseDetail.enrolled);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-gradient-to-br from-red-100 via-white to-red-50 py-8 md:py-16 border-b border-red-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {courseDetail.title}
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {courseDetail.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 md:gap-5">
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg text-sm md:text-base">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                <span className="ffont-bold text-base md:text-lg">
                  {courseDetail.averageRating}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  ({courseDetail.reviewCount} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg text-sm md:text-base">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                <span>{courseDetail.enrollmentCount} học viên</span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg text-sm md:text-base">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                <span>{courseDetail.totalDuration} giờ học</span>
              </div>
            </div>

            <div className="pt-4 border-t border-red-200">
              <p className="text-sm text-gray-500 mb-1">Giảng viên</p>
              <p className="font-semibold text-gray-800">
                {courseDetail.instructorName}
              </p>
              <p className="text-sm text-gray-600">
                {courseDetail.instructorBio}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 pt-6">
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold rounded-xl shadow-md hover:scale-[1.03] hover:shadow-lg transition-transform duration-200 justify-center flex">
                Mua khóa học ngay
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-6 py-3 border border-red-400 text-red-500 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-500 transition-all font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>

              <div className="w-full sm:w-auto flex items-center border border-red-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                <Tag className="w-5 h-5 text-gray-500 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="px-3 py-3 outline-none flex-1 w-full sm:w-44 text-sm bg-transparent text-gray-700 placeholder:text-gray-400 "
                />
                <button className="bg-gradient-to-r from-red-500 to-red-400 hover:bg-red-600 text-white font-medium px-4 py-3 transition-all whitespace-nowrap">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={
                courseDetail.thumbnail ||
                "https://via.placeholder.com/600x400?text=No+Thumbnail"
              }
              alt={courseDetail.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Về khóa học này</h2>
            <p className="text-gray-600 leading-relaxed">
              {courseDetail.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
                <CheckCircle className="w-5 h-5 text-red-500 mt-1" />
                <p>{courseDetail.objectives}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
            {courseDetail.chapters?.map((ch) => (
              <CourseModules
                key={ch.id}
                data={ch}
                isEnrolled={isEnrolledStrict}
                courseSlug={courseDetail.slug}
              />
            ))}
          </div>

          <div>
            <div className="pt-3 text-2xl font-bold"> Đánh giá</div>
            <div className="mt-4">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= userRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <textarea
                  rows={1}
                  type="text"
                  name="rate"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                  placeholder="Nhập đánh giá của bạn..."
                />
                <button
                  onClick={handlePostReview}
                  disabled={mutationReview.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg"
                >
                  Gửi
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 me-2" />
              <p className="text-2xl font-bold me-2">
                {courseDetail.averageRating?.toFixed(1) || 0}
              </p>
              <div className="text-2xl font-bold">
                • {reviews.length} đánh giá
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-red-200 rounded-xl p-4 bg-white hover:shadow-md transition"
                >
                  <div className="flex items-start">
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-red-200"
                      src={
                        review.userAvatar ||
                        "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"
                      }
                      alt={review.userFullName}
                    />
                    <div className="ms-4 flex-1">
                      <div className="font-bold text-gray-800">
                        {review.userFullName}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <div className="mt-3 text-gray-600 text-sm">
                        {review.comment}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 6 && (
              <div className="mt-8 text-center">
                <button className="border border-red-200 py-2 px-6 rounded-xl text-red-500 font-bold hover:bg-red-50 transition">
                  Xem tất cả đánh giá
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailCourse;
