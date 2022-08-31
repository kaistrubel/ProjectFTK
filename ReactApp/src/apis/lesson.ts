import http from "../http";
import ILesson, { ILessonInfo, IProblem } from "../types/Lesson";
import { IStudentAnalysisResponse } from "../types/User";

const getLessonsInfo = (courseSlug: string) => {
return http.get<ILessonInfo[]>(`lesson/GetLessonsInfo/?courseSlug=${courseSlug}`);
};

const getLesson = (lessonId: string) => {
  return http.get<ILesson>(`lesson/GetLesson/?lessonId=${lessonId}`);
  };

const getStudentAnalysis = (courseSlug: string, emails: string[]) => {
  return http.post<IStudentAnalysisResponse>(`lesson/GetAnalysis/?courseSlug=${courseSlug}`, emails);
}

const addProblem = (lessonId: string, url: string, level: number) => {
  return http.post(`lesson/AddProblem/?lessonId=${lessonId}&url=${url}&level=${level}`);
  };

const addVideo = (lessonId: string, url: string, level: number) => {
  return http.post(`lesson/AddVideo/?lessonId=${lessonId}&url=${url}&level=${level}`);
  };

const addNotes = (lessonId: string, url: string, level: number) => {
  return http.post(`lesson/AddNotes/?lessonId=${lessonId}&url=${url}&level=${level}`);
  };

const removeProblem = (lessonId: string, url: string) => {
  return http.post(`lesson/RemoveProblem/?lessonId=${lessonId}&url=${url}`);
  };

const removeVideo = (lessonId: string, url: string) => {
  return http.post(`lesson/RemoveVideo/?lessonId=${lessonId}&url=${url}`);
  };

const removeNotes = (lessonId: string, url: string) => {
  return http.post(`lesson/RemoveNotes/?lessonId=${lessonId}&url=${url}`);
  };

const updateVideoData = (lessonId: string, url: string, isCorrect: boolean) => {
  return http.post(`lesson/UpdateVideoData/?lessonId=${lessonId}&url=${url}&isCorrect=${isCorrect}`);
  };

const updateNotesData = (lessonId: string, url: string, isCorrect: boolean) => {
  return http.post(`lesson/UpdateNotesData/?lessonId=${lessonId}&url=${url}&isCorrect=${isCorrect}`);
  };

const LessonApi = {
    getLessonsInfo,
    getLesson,
    getStudentAnalysis,
    addProblem,
    addVideo,
    addNotes,
    removeProblem,
    removeVideo,
    removeNotes,
    updateVideoData,
    updateNotesData
  };
  
  export default LessonApi;