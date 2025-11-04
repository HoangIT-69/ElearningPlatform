package com.example.elearning.service;

import com.example.elearning.dto.response.CourseResponse;
import com.example.elearning.entity.Course;
import com.example.elearning.entity.User;
import org.springframework.stereotype.Service;

@Service
public class MappingHelperService {

    public CourseResponse mapToCourseResponse(Course course, User instructor) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setSlug(course.getSlug());
        response.setShortDescription(course.getShortDescription());
        response.setThumbnail(course.getThumbnail());
        response.setLevel(course.getLevel());
        response.setStatus(course.getStatus());
        response.setPrice(course.getPrice());
        response.setIsFree(course.getIsFree());
        response.setTotalDuration(course.getTotalDuration());
        response.setEnrollmentCount(course.getEnrollmentCount());
        response.setAverageRating(course.getAverageRating());
        response.setReviewCount(course.getReviewCount());
        response.setInstructorId(course.getInstructorId());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        if (instructor != null) {
            response.setInstructorName(instructor.getFullName());
        } else {
            response.setInstructorName("N/A");
        }
        return response;
    }
}