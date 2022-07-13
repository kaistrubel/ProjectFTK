export default interface IUserInfo {
    name: string,
    email: string,
    pictureUrl: string,
    roles: string[],
    isAuthenticated: boolean,
    isTeacher: boolean,
  }

  export interface IPerson {
    email: string,
    classIds: string[],
    progress: Map<string, number>,
  }