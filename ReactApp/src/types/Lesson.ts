export interface ILecture {
    url: string,
    level: number,
    gain: number,
    views: number,
    author: string,
  }

export interface IProblem {
  url: string,
  level: number,
  gain: number,
  attempts: number,
  author: string,
  }

export default interface ILesson{
    problems: IProblem[],
    videos: ILecture[],
    notes: ILecture[],
    lessonId: string,
  }

export interface ILessonInfo {
    name: string,
    unit: string,
    order: number,
    lessonId: string,
  }