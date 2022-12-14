import http from "../http";
import IUser, { LabProg, Progress } from "../types/User";

const currentUser = () => {
    return http.get<IUser>(`user/CurrentUser/`);
    };

const getUser = (email: string) => {
    return http.get<IUser>(`user/GetUser/?email=${email}`);
    };

const updateUserProgress = (progressList: Progress[], updatedProgress: Progress) => {
    
    var data = {
        progressList: progressList,
        updatedProgress: updatedProgress,
    };
    return http.post<string>('user/UpdateUserProgress/', data);
    };

const updateUserLabProg = (labProgList: LabProg[], currentLabName: string, submissionIdx: number, submissionUrl: string, state: string) => {

    var data = {
        labProgList: labProgList,
        currentLabName: currentLabName,
        submissionIdx: submissionIdx,
        submissionUrl: submissionUrl,
        state: state,
    };
    return http.post<string>('user/UpdateUserLabProg/', data);
    };

const UserApi = {
    currentUser,
    getUser,
    updateUserProgress,
    updateUserLabProg
  };
  
  export default UserApi;