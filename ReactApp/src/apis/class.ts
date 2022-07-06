import http from "../http";
import IClass from "../types/Course";
import ISubject from "../types/Subject";

const getCurrentClasses = () => {
    return http.get<IClass[]>(`class/getcurrentclasses/`);
    };

const getSupportedSubjects = () => {
    return http.get<ISubject[]>(`class/getsupportedsubjects/`);
    };

const createClass = (courseSlug: string, period:string) => {
return http.get<string>(`class/createclass/?courseSlug=${courseSlug}&period=${period}`);
};

const joinClass = (teacherEmail: string, code:string) => {
    return http.get<string>(`class/joinclass/?teacherEmail=${teacherEmail}&code=${code}`);
    };

const ClassApi = {
    getCurrentClasses,
    getSupportedSubjects,
    createClass,
    joinClass
  };
  
  export default ClassApi;