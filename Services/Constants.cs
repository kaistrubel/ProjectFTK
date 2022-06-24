using System;
using Newtonsoft.Json;
using ProjectFTK.Models;

namespace ProjectFTK.Services;

public static class Constants
{
    public static List<Subject> GetSupportedSubjects()
    {
        var subjectsJson = File.ReadAllText("DataJson/subjects.json");
        List<Subject> subjects = JsonConvert.DeserializeObject<List<Subject>>(subjectsJson);

        return subjects;
    }

    public static readonly string PPHS = "PPHS";
    public static readonly string LessonsDbName = "Lessons";
    public static readonly string LecturesDbName = "Lectures";
    public static readonly string ClassesContainerName = "Classes";
    public static readonly string StudentsContainerName = "Students";
}
