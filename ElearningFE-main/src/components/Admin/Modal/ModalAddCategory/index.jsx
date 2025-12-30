import { memo, useState } from "react";
import * as categoryService from "../../../../service/admin/categoryService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ModalAddCategory = ({ onClose }) => {
  const [selectedParentId, setSelectedParentId] = useState();
  console.log(selectedParentId);
  const [formData, setFormData] = useState({
    categoryName: "",
    parentId: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async () => {
  try {
    let parentIdToUse = null;

    if (selectedParentId && selectedParentId !== "0") {
      parentIdToUse = Number(selectedParentId);
    }

    const res = await categoryService.createCategory(
      formData.categoryName,
      parentIdToUse
    );

    if (res?.success) {
      toast.success("Thêm danh mục thành công");
      onClose();
    } else {
      toast.error(res?.message || "Thêm danh mục thất bại");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
    );
  }
};


  const fetchCategoriesTree = async () => {
    const res = await categoryService.getAllCategoriesTree();  
    return res;
  }

  const {data: categoriesTree = []} = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesTree
  })

  const fetchCategories = async () => {
    const res = await categoryService.getAllCategories();
    return res;
  }
  
  const {data: allCategories = []} = useQuery({
    queryKey: ['all-categories'],
    queryFn: fetchCategories
  })

  console.log("All Categories:", categoriesTree);
  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm flex items-center justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-1/2  border border-red-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-2xl text-red-500 whitespace-nowrap">
            Thêm danh mục mới
          </div>
        </div>
        <div>
          <div>
            <label className="text-l font-bold">Tên danh mục</label>
            <input
              type="text"
              onChange={handleOnChange}
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Nhập tên danh mục"
              name="categoryName"
            />
          </div>

          <select
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
            className="border border-red-200 rounded-md py-3 px-4 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400 w-full"
          >
            <option value="0">Chọn danh mục</option>
            {categoriesTree?.data?.map((category) => (
              <option key={category?.id} value={category?.id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-2xl">
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalAddCategory);
