import { memo, useState } from "react";

const TabSelect = ({ activeTab, handleOnTabChange }) => {
  return (
    <div className="">
      <ul className="space-y-2">
        <li
          onClick={() => handleOnTabChange("info")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "info"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Thông tin
        </li>
        <li
          onClick={() => handleOnTabChange("mycourse")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "mycourse"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Khoá học của tôi
        </li>
        <li
          onClick={() => handleOnTabChange("history")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "history"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Lịch sử mua{" "}
        </li>
        <li className="p-2 rounded-lg font-semibold hover:bg-red-200 hover:text-white cursor-pointer">
          Đăng xuất
        </li>
      </ul>
    </div>
  );
};

export default memo(TabSelect);
