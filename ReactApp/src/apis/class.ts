import http from "../http";
import IClass from "../types/Course";
import ISubject from "../types/subject";

const getCurrentClasses = () => {
    return http.get<IClass[]>(`class/getcurrentclasses/`);
    };

const getSupportedSubjects = () => {
    return http.get<ISubject[]>(`class/getsupportedsubjects/`);
    };

const ClassApi = {
    getCurrentClasses,
    getSupportedSubjects
  };
  
  export default ClassApi;