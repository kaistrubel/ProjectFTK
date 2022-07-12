import http from "../http";
import IStudent from "../types/Student";

const getStudent = () => {
    return http.get<IStudent>(`student/GetStudent/`);
    };

const updateStudentProgress = (student: IStudent) => {
    return http.post<string>(`student/UpdateStudentProgress/?student=${student}`);
    };

const StudentApi = {
    getStudent,
    updateStudentProgress
  };
  
  export default StudentApi;