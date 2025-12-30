import { memo, useState } from "react";

const TabSelect = ({ activeTab, handleOnTabChange }) => {
  return (
    <div className="">
      <ul className="space-y-2">
        <li
          onClick={() => handleOnTabChange("dashboard")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "dashboard"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Dashboard
        </li>
        <li
          onClick={() => handleOnTabChange("courses")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "courses"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Khoá học
        </li>
        <li
          onClick={() => handleOnTabChange("createCourse")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "createCourse"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Tạo khoá học
        </li>
        <li
          onClick={() => handleOnTabChange("categories")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "categories"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Danh mục khoá học{" "}
        </li>
        <li
          onClick={() => handleOnTabChange("users")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "users"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Người dùng
        </li>
        <li
          onClick={() => handleOnTabChange("orders")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "orders"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Đơn hàng
        </li>
        
        <li
          onClick={() => handleOnTabChange("analytics")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "analytics"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}
        >
          Analytics
        </li>

        <li className="p-2 rounded-lg font-semibold hover:bg-red-200 hover:text-white cursor-pointer">
          Đăng xuất
        </li>
      </ul>
    </div>
  );
};

export default memo(TabSelect);
