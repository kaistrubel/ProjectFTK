export default interface IUser {
  name: string,
  email: string,
  pictureUrl: string,
  classIds: string[],
  progressList: Progress[],
  isAuthenticated: boolean,
  isTeacher: boolean,
}

export class Progress {
  constructor(public lessonId: string, public level: number, public activeSeconds: number, public attempts: number) {
    this.lessonId = lessonId;
    this.level = level;
    this.activeSeconds = activeSeconds;
    this.attempts = attempts;
  }
}