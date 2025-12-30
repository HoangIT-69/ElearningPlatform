import { Book, Clock, Plus, Users } from "lucide-react";
import * as courseService from "../../../service/courseService";
import { useQuery } from "@tanstack/react-query";
import TabSelect from "./TabSelect";
import CourseSetting from "./CourseSetting";
import CourseCurriculum from "./CourseCurriculum";
import { useState } from "react";
import Course from "../../Course";

const EditCourse = ({ onClose, courseId }) => {
  const [activeTab, setActiveTab] = useState("courseCurriculum");
  
  const handleOnTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchCourseDetails = async () => {
    const data = await courseService.getCourseById(courseId);
    return data;
  };

  const {
    data: courseDetails,
    isLoading,
  } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: fetchCourseDetails,
    enabled: !!courseId,
  });


  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-5/6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-2xl text-red-500">Chỉnh sửa khoá học</div>
          
        </div>
        
         <TabSelect activeTab={activeTab}
            handleOnTabChange={handleOnTabChange}
          /> 

          <div className="w-full bg-white  rounded-xl shadow-md border border-red-200">
          {!isLoading && courseDetails && (
            <>
              {activeTab === "courseCurriculum" && (
                <CourseCurriculum course={courseDetails} />
              )}

              {activeTab === "courseSetting" && (
                <CourseSetting course={courseDetails} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
