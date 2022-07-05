export default interface ICourse {
    id: string,
    code: string,
    teacherEmail: string,
    students: string[],
    courseSlug: string,
    displayName: string,
  }