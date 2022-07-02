import axios, { AxiosResponse } from "axios";
import IUserInfo from "./types/User";

const instance = axios.create({
  baseURL: "https://localhost:7066/",
  headers: {
    "Content-type": "application/json"
  },
  withCredentials : true
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => instance.get(url).then(responseBody),
	post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
	put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
	delete: (url: string) => instance.delete(url).then(responseBody),
};

export const UserInfo = {
	getInfo: (): Promise<IUserInfo> => requests.get('user/info'),
};