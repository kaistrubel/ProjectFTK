import http from "../http";
import IUserInfo from "../types/User";

const get = () => {
    return http.get<IUserInfo>(`user/info/`);
    };

const UserApi = {
    get,
  };
  
  export default UserApi;