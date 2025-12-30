import { act, memo } from "react";

const TabSelect = ({activeTab, handleOnTabChange}) => {
  return (
    <div className="flex mb-5">
        <div onClick={() => handleOnTabChange("courseCurriculum")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "courseCurriculum"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}>
            Chương trình giảng dạy
        </div>

        <div onClick={() => handleOnTabChange("courseSetting")}
          className={`p-2 rounded-lg font-semibold 
          ${
            activeTab === "courseSetting"
              ? "bg-red-500 text-white"
              : "hover:bg-red-200 hover:text-white cursor-pointer"
          }`}>
            Cài đặt khoá học
        </div>
    </div>
  );

};

export default memo(TabSelect);