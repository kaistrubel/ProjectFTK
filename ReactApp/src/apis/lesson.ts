import http from "../http";
import ILesson, { IProblem } from "../types/Lesson";
import { IStudentAnalysis } from "../types/User";

const getLessons = (courseSlug: string) => {
return http.get<ILesson[]>(`lesson/getLessons/?courseSlug=${courseSlug}`);
};

const getProblems = (lessonId: string) => {
  return http.get<IProblem[]>(`lesson/GetProblems/?lessonId=${lessonId}`);
  };

const getStudentAnalysis = (courseSlug: string, startDate: string, emails: string[]) => {
  return http.post<IStudentAnalysis[]>(`lesson/GetAnalysis/?courseSlug=${courseSlug}&startDate=${startDate}`, emails);
}

const LessonApi = {
    getLessons,
    getProblems,
    getStudentAnalysis
  };
  
  export default LessonApi;