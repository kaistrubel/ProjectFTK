export default interface ICourse {
    id: string,
    code: string,
    startDate: string,
    teacherEmail: string,
    students: string[],
    courseSlug: string,
    displayName: string,
  }