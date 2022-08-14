import http from "../http";
import { ILab } from "../types/Lab";

const getLabInfo = (courseSlug: string) => {
    return http.get<ILab[]>(`lab/GetLabInfo/?courseSlug=${courseSlug}`);
    };

const LabApi = {
    getLabInfo,
  };
  
  export default LabApi;