import http from "../http";
import IClass from "../types/Course";

const getCurrentClasses = () => {
    return http.get<IClass[]>(`class/getcurrentclasses/`);
    };

const ClassApi = {
    getCurrentClasses,
  };
  
  export default ClassApi;