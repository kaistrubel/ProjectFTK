export default interface IUser {
  name: string,
  email: string,
  pictureUrl: string,
  classIds: string[],
  progressList: Progress[],
  labProgList: LabProg[],
  isAuthenticated: boolean,
  isTeacher: boolean,
}

export interface IStudentAnalysisResponse{
  status: string,
  recommendation: string,
  needsAttentions: string,
  students: IStudentAnalysis[],
}

export interface IStudentAnalysis{
  name: string,
  email: string,
  photoUrl: string,
  lesson: string,
  lab: string,
  status: string,
  time: string,
}

export class Progress {
  constructor(public lessonId: string, public level: number, public activeSeconds: number, public attempts: number) {
    this.lessonId = lessonId;
    this.level = level;
    this.activeSeconds = activeSeconds;
    this.attempts = attempts;
  }
}

export interface ISubmissions{
  url: string,
  state: string,
  details: string,
}

export class LabProg {
  constructor(public name: string, public submissions: ISubmissions[]) {
    this.name = name;
    this.submissions = submissions;
  }
}