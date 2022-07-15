import http from "../http";
import ILesson, { IProblem } from "../types/Lesson";

const getLessons = (courseSlug: string) => {
return http.get<ILesson[]>(`lesson/getLessons/?courseSlug=${courseSlug}`);
};

const getProblems = (lessonId: string) => {
  return http.get<IProblem[]>(`lesson/GetProblems/?lessonId=${lessonId}`);
  };

const LessonApi = {
    getLessons,
    getProblems
  };
  
  export default LessonApi;