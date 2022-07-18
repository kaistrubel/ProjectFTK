import http from "../http";
import IUser, { Progress } from "../types/User";

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

const UserApi = {
    currentUser,
    getUser,
    updateUserProgress
  };
  
  export default UserApi;