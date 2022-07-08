import http from "../http";
import ILesson from "../types/Lesson";

const getLessons = (courseSlug: string) => {
return http.get<ILesson[]>(`lesson/getLessons/?courseSlug=${courseSlug}`);
};

const LessonApi = {
    getLessons,
  };
  
  export default LessonApi;