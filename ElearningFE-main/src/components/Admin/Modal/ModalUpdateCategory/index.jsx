import { memo, useEffect, useState } from "react";
import * as categoryService from "../../../../service/admin/categoryService";
import { toast } from "react-toastify";

const ModalUpdateCategory = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(category.name);
  }, [category]);

  const handleUpdate = async () => {
    try {
      const res = await categoryService.updateCategory(category.id, {
        name,
        parentId: category.parentId ?? null,
      });

      if (res.success) {
        toast.success("Cập nhật danh mục thành công");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra");
    }
  };

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
            Cập nhật {category.parentId ? "danh mục con" : "danh mục cha"}
          </div>
        </div>
        <div>
          <div>
            <label className="text-l font-bold">Tên danh mục</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Nhập tên danh mục cha"
              name="parentCategoryName"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-red-500 font-semibold py-2 px-3 rounded-2xl border border-red-200"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdate}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-2xl"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalUpdateCategory);
