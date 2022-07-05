import ICourse from "./Course";

export default interface ISubject {
    subjectSlug: string,
    displayName: string,
    courses: ICourse[],
  }