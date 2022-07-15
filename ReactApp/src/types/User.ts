export default interface IUserInfo {
    name: string,
    email: string,
    pictureUrl: string,
    roles: string[],
    isAuthenticated: boolean,
    isTeacher: boolean,
  }

  export interface IPerson {
    name: string,
    email: string,
    pictureUrl: string,
    classIds: string[],
    progress: Progress[],
  }

  export class Progress {
    constructor(public lessonId: string, public level: number, public timeSpent: string) {
      this.lessonId = lessonId;
      this.level = level;
      this.timeSpent = timeSpent;
    }
  }