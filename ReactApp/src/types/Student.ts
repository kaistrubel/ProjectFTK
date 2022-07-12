export default interface IStudent {
    email: string,
    classIds: string[],
    progress: Map<string, number>,
  }