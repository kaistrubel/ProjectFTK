import http from "../http";
import IUserInfo, { IPerson } from "../types/User";

const getInfo = () => {
    return http.get<IUserInfo>(`user/info/`);
    };

const getUser = () => {
    return http.get<IPerson>(`user/GetUser/`);
    };

const updateUserProgress = (user: IPerson) => {
    return http.post<string>(`user/UpdateUserProgress/?user=${user}`);
    };

const UserApi = {
    getInfo,
    getUser,
    updateUserProgress
  };
  
  export default UserApi;