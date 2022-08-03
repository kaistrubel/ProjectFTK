export default interface ICourse {
    id: string,
    code: string,
    teacherEmail: string,
    users: string[],
    courseSlug: string,
    displayName: string,
  }