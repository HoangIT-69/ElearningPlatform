import React, { useState, useEffect } from "react";
import Course from "../../../components/Course";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import * as courseService from "../../../service/courseService";
import * as categoryService from "../../../service/CategoryService";
import { Filter } from "lucide-react";


const ListCourse = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("search") || "";

  useEffect(() => {
    setPage(0);
  }, [selectedLevel, selectedPrice, selectedCategory, searchText]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-tree"],
    queryFn: categoryService.getCategoryTree,
  });

  const fetchCourses = async (page, size, level, price, categoryId, searchText) => {
    const filters = {};
    if (level && level !== "Tất cả") filters.level = level;
    if (price && price !== "Tất cả") {
      filters.isFree = price === "Miễn phí";
    }
    if (categoryId) filters.categoryId = categoryId;
    if (searchText.trim() !== "") filters.search = searchText.trim();

    const data = await courseService.getAllCourses(page, size, filters);
    return data;
  };

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", page, size, selectedLevel, selectedPrice, selectedCategory, searchText],
    queryFn: () => fetchCourses(page, size, selectedLevel, selectedPrice, selectedCategory, searchText),
  });

  const courseList = courses?.data?.content || [];
  const totalPages = courses?.data?.totalPages || 1;

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((cat) => (
      <div key={cat.id}>
        <label className="flex items-center gap-2 cursor-pointer my-2">
          <input
            type="radio"
            name="category"
            checked={selectedCategory === cat.id}
            onChange={() => setSelectedCategory(cat.id)}
            className="w-4 h-4 rounded border-gray-300 accent-red-500"
          />
          <span style={{ marginLeft: level * 12 }} className="text-gray-600">
            {cat.name}
          </span>
        </label>

        {cat.children?.length > 0 && (
          <div className="ml-4">
            {renderCategoryTree(cat.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return <p className="text-center py-10">Đang tải khóa học...</p>;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-white py-8 md:py-15 border-b border-red-200">
      <div className="mx-auto px-4 md:px-0 w-full md:w-5/6 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-1 md:col-span-3">
          
          <button 
            className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-red-200 p-3 rounded-lg shadow-sm text-red-500 font-bold mb-4"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <Filter size={20} />
            {showMobileFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc tìm kiếm"}
          </button>

          <div className={`${showMobileFilter ? 'block' : 'hidden'} md:block bg-white rounded-xl shadow p-6 border border-red-200 h-fit md:mt-26`}>
            <div className="border-b border-red-200 pb-4 mb-6">
              <p className="font-bold text-foreground text-red-500 mb-3">Danh mục</p>
              <label className="flex items-center gap-2 cursor-pointer my-2">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === undefined}
                  onChange={() => setSelectedCategory(undefined)}
                  className="w-4 h-4 rounded border-gray-300 accent-red-500"
                />
                <span className="text-gray-600 text-sm md:text-base">Tất cả</span>
              </label>
              {renderCategoryTree(categories?.data || [])}
            </div>

            <div className="border-b border-red-200 pb-4 mb-6">
              <p className="font-bold text-foreground text-red-500 mb-3">Cấp độ</p>
              {["Tất cả", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 cursor-pointer my-2"
                >
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={selectedLevel === level}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-4 h-4 rounded border-gray-300 accent-red-500"
                  />
                  <span className="text-gray-600 text-sm md:text-base">
                    {level === "Tất cả"
                      ? "Tất cả"
                      : level === "BEGINNER"
                      ? "Mới bắt đầu"
                      : level === "INTERMEDIATE"
                      ? "Trung bình"
                      : "Nâng cao"}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <p className="font-bold text-foreground text-red-500 mb-3">Giá cả</p>
              {["Tất cả", "Miễn phí", "Trả phí"].map((price) => (
                <label
                  key={price}
                  className="flex items-center gap-2 cursor-pointer my-2"
                >
                  <input
                    type="radio"
                    name="price"
                    value={price}
                    checked={selectedPrice === price}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-4 h-4 rounded border-gray-300 accent-red-500"
                  />
                  <span className="text-gray-600 text-sm md:text-base">{price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-9">
          <div className="max-w-7xl mx-auto ">
            <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-0 text-red-500 md:text-left">
                Các khóa học
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto">
              {courseList.length > 0 ? (
                courseList.map((course) => (
                  <Course key={course.id} data={course} />
                ))
              ) : (
                <p className="text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10">
                  Không có khóa học phù hợp.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm p-1 justify-center mt-5">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 md:px-7 md:py-2 flex items-center justify-center text-gray-500 bg-gray-100 rounded-md font-medium hover:bg-red-200 transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => index)
              .filter(
                (num) =>
                  num === 0 ||
                  num === totalPages - 1 ||
                  (num >= page - 2 && num <= page + 2)
              )
              .map((num, idx, arr) => {
                const isEllipsis = idx > 0 && num !== arr[idx - 1] + 1;
                return (
                  <React.Fragment key={num}>
                    {isEllipsis && (
                      <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-gray-500">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setPage(num)}
                      className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md font-medium transition-colors text-sm md:text-base ${
                        page === num
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-red-200"
                      }`}
                    >
                      {num + 1}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page === totalPages - 1}
              className="px-4 py-2 md:px-7 md:py-2 flex items-center justify-center text-gray-500 bg-gray-100 rounded-md font-medium hover:bg-red-200 transition-colors disabled:opacity-50 text-sm md:text-base"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCourse;
