import { memo, useState } from "react";
import * as categoryService from "../../../../service/admin/categoryService";
import { toast } from "react-toastify";
import ModalUpdateCategory from "../../Modal/ModalUpdateCategory";

const CategoryCard = ({ category, refetch }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await categoryService.deleteCategory(categoryId);
      refetch();
      if (res.success === true) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      return res;
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  return (
    <div className="py-3 w-full border border-red-200 rounded-md px-4  mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowDetails(!showDetails)}>
            {category?.children?.length > 0 &&
              (showDetails ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m20 9l-8 8l-8-8l2-2l6 6l6-6z"
                  />
                </svg>
              ))}
          </button>
          <div>
            <h3 className="text-[16px] font-bold">{category?.name}</h3>
            <p className="text-[14px]">{category?.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[16px]">
          <div className="py-2 px-4 rounded-2xl bg-red-100 text-red-600 font-semibold">
            <p>{category?.children?.length} children</p>
          </div>

          <button
            onClick={() => {
              setEditingCategory(category);
              setOpenModalEdit(true);
            }}
            className=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 21h18M12.222 5.828L15.05 3L20 7.95l-2.828 2.828m-4.95-4.95l-5.607 5.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l5.607-5.607m-4.95-4.95l4.95 4.95"
              />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className=""
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625"
              />
            </svg>
          </button>
        </div>
      </div>
      {showDetails &&
        category?.children?.length > 0 &&
        category.children.map((child) => (
          <div
            key={child.id}
            className="pl-8 flex mt-4 justify-between w-full p-4 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-[16px] font-bold">{child.name}</h3>
                <p className="text-[14px">{child.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[16px]">
              <button
                onClick={() => {
                  setEditingCategory(child);
                  setOpenModalEdit(true);
                }}
                className=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 21h18M12.222 5.828L15.05 3L20 7.95l-2.828 2.828m-4.95-4.95l-5.607 5.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l5.607-5.607m-4.95-4.95l4.95 4.95"
                  />
                </svg>
              </button>
              {/* Delete */}
              <button
                onClick={() => handleDeleteCategory(child.id)}
                className=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      {openModalEdit && (
        <ModalUpdateCategory
          category={editingCategory}
          onClose={() => {
            setOpenModalEdit(false);
            setEditingCategory(null);
          }}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default memo(CategoryCard);
