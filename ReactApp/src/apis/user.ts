import http from "../http";
import IUserInfo, { IPerson, Progress } from "../types/User";

const getInfo = () => {
    return http.get<IUserInfo>(`user/info/`);
    };

const getUser = () => {
    return http.get<IPerson>(`user/GetUser/`);
    };

const updateUserProgress = (user: IPerson, progress: Progress) => {
    
    console.log("REQ: " + user.email + " PROG: " + progress.level )
    var data = {
        user: user,
        updatedProgress: progress,
    };
    return http.post<string>('user/UpdateUserProgress/', data);
    };

const UserApi = {
    getInfo,
    getUser,
    updateUserProgress
  };
  
  export default UserApi;