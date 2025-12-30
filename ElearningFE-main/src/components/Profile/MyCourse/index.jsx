import { Link } from "react-router-dom";
import { useState, useEffect, use } from "react";
import Course from "../../Course";
import MyCourseCard from "./MyCourseCard";
import { useQuery } from "@tanstack/react-query";
import * as profileService from "../../../service/profileService";

const MyCourse = () => {
  const fetchMyCourses = async () => {
    const res = await profileService.myCourse();
    return res?.data ?? [];
  }

  const { data: myCourses = [] } = useQuery({
    queryKey: ["my-courses"],
    queryFn: fetchMyCourses,
  });
  return (
    <div className="p-6">
      <div className="font-bold text-2xl text-red-500">
        Các khoá học của tôi
      </div>
      
        <div className="grid grid-cols-2 gap-6 mt-6">
          {myCourses.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))}
        </div>
    </div>
  );
};

export default MyCourse;
