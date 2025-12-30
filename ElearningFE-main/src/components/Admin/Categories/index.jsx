import { Search } from "lucide-react";
import { memo, useState } from "react";
import ModalAddCategory from "../Modal/ModalAddCategory";
import ListCategory from "./ListCategory";

const Categories = () => {
const [openModalAdd, setOpenModalAdd] = useState(false);  
  return (
    <div>
      <div className=" p-4 border-b border-red-200 shadow-sm flex items-center justify-between">
        <div className="font-bold text-2xl text-red-500">Danh mục</div>
        <div className="flex w-1/2 items-center border border-red-400 rounded-full px-3 py-4 hover:bg-red-50 focus-within:!bg-white focus-within:ring-2 focus-within:ring-red-500 mx-4 cursor-pointer ">
          {" "}
          <Search className="text-gray-500 me-2 " size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {" "}
          <button
          onClick={() => setOpenModalAdd(true)}
           className="px-4 py-2 bg-red-500 whitespace-nowrap rounded-2xl text-white font-bold">
            Thêm danh mục mới
          </button>
        </div>
      </div>
      <ListCategory />
      {openModalAdd && <ModalAddCategory onClose={() => setOpenModalAdd(false)}/>}
    </div>
  );
};

export default memo(Categories);
