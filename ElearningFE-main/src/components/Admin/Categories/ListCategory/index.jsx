import { memo } from "react";
import CategoryCard from "../CategoryCard";
import * as categoryService from "../../../../service/admin/categoryService";
import { useQuery } from "@tanstack/react-query";

const ListCategory = () => {
  const fetchCategories = async () => {
    const res = await categoryService.getAllCategoriesTree();
    console.log("Fetched categories in CategoryCard:", res);
    return res;
  };

  const { data: categories = [], refetch } = useQuery({
    queryKey: ["categories-card"],
    queryFn: fetchCategories,
  });
  return (
    <div className="p-[16px] space-y-4">
      {categories?.data?.map((category) => (
        <CategoryCard key={category?.id} category={category} refetch={refetch} />
      ))}
    </div>
  );
};
export default memo(ListCategory);
