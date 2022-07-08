export interface IVideo {
    url: string,
    gain: number
  }

export interface IProblem {
    url: string,
    level: number,
    gain: number,
    videos: IVideo[],
  }

export default interface ILesson {
    name: string,
    unit: string,
    order: number,
    courseSlug: string,
    id: string,
    problems: IProblem[],
  }