import http from "../http";
import ILesson, { ILessonInfo, IProblem } from "../types/Lesson";
import { IStudentAnalysis } from "../types/User";

const getLessonsInfo = (courseSlug: string) => {
return http.get<ILessonInfo[]>(`lesson/GetLessonsInfo/?courseSlug=${courseSlug}`);
};

const getLesson = (lessonId: string) => {
  return http.get<ILesson>(`lesson/GetLesson/?lessonId=${lessonId}`);
  };

const getStudentAnalysis = (courseSlug: string, startDate: string, emails: string[]) => {
  return http.post<IStudentAnalysis[]>(`lesson/GetAnalysis/?courseSlug=${courseSlug}&startDate=${startDate}`, emails);
}

const LessonApi = {
    getLessonsInfo,
    getLesson,
    getStudentAnalysis
  };
  
  export default LessonApi;