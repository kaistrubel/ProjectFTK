import http from "../http";
import { ILab } from "../types/Lab";
import IUser, { LabProg } from "../types/User";

const getLabInfo = (courseSlug: string) => {
    return http.get<ILab[]>(`lab/GetLabInfo/?courseSlug=${courseSlug}`);
    };

const getStudents = (courseSlug: string, emails: string[]) => {
    return http.post<IUser[]>(`lab/GetStudents/?courseSlug=${courseSlug}`, emails);
    };

const gradeLab = (studentEmail: string, labName: string, idx: number, state: string, details: string, labProgList: LabProg[]) => {
    return http.post<IUser[]>(`lab/GradeLab/?studentEmail=${studentEmail}&labName=${labName}&idx=${idx}&state=${state}&details=${details}`, labProgList);
    };

const LabApi = {
    getLabInfo,
    getStudents,
    gradeLab
  };
  
  export default LabApi;