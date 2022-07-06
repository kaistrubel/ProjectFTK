import http from "../http";
import IClass from "../types/Course";
import ISubject from "../types/subject";

const getCurrentClasses = () => {
    return http.get<IClass[]>(`class/getcurrentclasses/`);
    };

const getSupportedSubjects = () => {
    return http.get<ISubject[]>(`class/getsupportedsubjects/`);
    };

const createClass = (courseSlug: string, period:string) => {
return http.get<string>(`class/createclass/?courseSlug=${courseSlug}&period=${period}`);
};

const ClassApi = {
    getCurrentClasses,
    getSupportedSubjects,
    createClass
  };
  
  export default ClassApi;