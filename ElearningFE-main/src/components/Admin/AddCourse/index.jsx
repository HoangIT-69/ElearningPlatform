import { Book, Clock, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import * as categoryService from "../../../service/CategoryService";
import { toast } from "react-toastify";
import * as courseService from "../../../service/admin/courseService";

const AddCourse = ({ onClose, onOpenEdit }) => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    courseDescription: "",
    thumbnail: "",
    level: "BEGINNER",
    price: "",
    categoryId: null,
    categoryName: "Chọn danh mục",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderTreeOptions = (nodes, level = 0) => {
    return nodes.flatMap((node) => [
      <option key={node.id} value={node.id} style={{ whiteSpace: "pre" }}>
        {`${"   ".repeat(level)}${level > 0 ? "↳ " : ""}${node.name}`}
      </option>,
      ...renderTreeOptions(node.children || [], level + 1),
    ]);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategoryTree();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Lỗi load category:", error);
        toast.error("Không thể tải danh mục!");
      }
    };
    loadCategories();
  }, []);

  const handleSaveCourse = async () => {
  if (!formData.title.trim())
    return toast.error("Tên khoá học không được để trống!");

  if (!formData.categoryId)
    return toast.error("Vui lòng chọn danh mục!");

  setIsLoading(true);
  const loadingToast = toast.loading("Đang tạo khoá học...");

  try {
    const coursePayload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      courseDescription: formData.courseDescription, // FIX
      thumbnail: formData.thumbnail,
      level: formData.level,
      status: "DRAFT",
      isFree,
      price: isFree ? 0 : Number(formData.price),
    };

    const courseRes = await courseService.createCourse(coursePayload);
    console.log("courseRes ===>", courseRes);

   const newCourseId = courseRes?.data?.id;

    if (!newCourseId) throw new Error("Không lấy được ID khoá học mới!");

    await courseService.createCourseCategory({
      courseId: newCourseId,
      categoryId: formData.categoryId,
    });

    toast.update(loadingToast, {
      render: "Tạo khoá học thành công!",
      type: "success",
      isLoading: false,
      autoClose: 1500,
    });

    setTimeout(() => {onClose(); onOpenEdit(newCourseId);}, 500);

  } catch (error) {
    console.log(error);

    toast.update(loadingToast, {
      render: error.response?.data?.message || "Lỗi khi tạo khoá học!",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-5/6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-2xl text-red-500">Thêm khoá học</div>
          <button
            onClick={handleSaveCourse}
            disabled={isLoading}
            className={`bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-2xl px-6 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Đang lưu..." : "Lưu khoá học"}
          </button>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="border border-red-200 rounded-2xl p-4 space-y-4">
              <div className="font-bold text-red-500 text-2xl">
                Thông tin khoá học
              </div>
              <div>
                <div>
                  <div className="text-l font-bold">Tên hoá học</div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                    placeholder="Nhập tên khoá học"
                  />
                </div>

                <div>
                  <div className="text-l font-bold">Mô tả ngắn</div>
                  <textarea
                    rows={3}
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                    placeholder="Mô tả ngắn gọn về khoá học"
                  />
                </div>

                <div>
                  <div className="text-l font-bold">Mô tả khoá học</div>
                  <textarea
                    rows={5}
                    type="text"
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleChange}
                    className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                    placeholder="Mô tả khoá học"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-l font-bold">Danh mục</div>
                    <div className="relative">
                      <div className="relative mt-2 mb-4">
                        <div
                          onClick={() => setOpenCategory((prev) => !prev)}
                          className="w-full border border-red-500 rounded-xl py-3 px-4 cursor-pointer bg-white"
                        >
                          {formData.categoryName || "Select category"}
                        </div>

                        {openCategory && (
                          <div className="absolute z-20 w-full bg-white border border-red-300 rounded-xl mt-2 shadow-lg max-h-64 overflow-auto">
                            {categories.map((cat) => (
                              <div key={cat.id}>
                                <div
                                  className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      categoryId: cat.id,
                                      categoryName: cat.name,
                                    }));
                                    setOpenCategory(false);
                                  }}
                                >
                                  {cat.name}
                                </div>

                                {cat.children?.map((child) => (
                                  <div
                                    key={child.id}
                                    className="pl-8 px-4 py-2 hover:bg-red-50 cursor-pointer text-gray-700"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        categoryId: child.id,
                                        categoryName: child.name,
                                      }));
                                      setOpenCategory(false);
                                    }}
                                  >
                                    {child.name}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 27 27"
                        >
                          <path
                            fill="currentColor"
                            d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-l font-bold">Cấp độ</div>
                    <div className="relative">
                      <select
                        name ="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="
                        w-full
                        border
                        border-red-500
                        rounded-xl
                        py-3
                        px-4
                        mt-2
                        mb-4
                        text-black
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-400
                        appearance-none
    "
                      >
                        <option value="" disabled selected>
                            -- Chọn level --
                        </option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>

                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 27 27"
                        >
                          <path
                            fill="currentColor"
                            d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {!isFree && (
                  <div className="">
                    <div className="text-l font-bold">Giá</div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                      placeholder="Giá khoá học"
                      
                    />
                  </div>
                )}

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    className="accent-red-500"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                  />
                  Miễn phí
                </label>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="border border-red-200 rounded-2xl p-4">
              <div className="font-bold text-red-500 text-xl">Ảnh</div>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                placeholder="URL ảnh"
              />
              {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" onError={(e) => e.target.style.display='none'}/>
              )}
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-6 space-y-2">
              <div className="font-bold text-red-500 text-xl">
                Thống kê khóa học
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Book size={16} />
                  Chương
                </div>
                <div>0</div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Bài học
                </div>
                <div>0</div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  Thời gian
                </div>
                <div>-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
