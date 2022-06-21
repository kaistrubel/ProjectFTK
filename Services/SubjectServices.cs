using System;
using Newtonsoft.Json;
using ProjectFTK.Models;

namespace ProjectFTK.Services;

public static class SubjectServices
{
    public static List<Subject> GetSupportedSubjects()
    {
        var subjectsJson = System.IO.File.ReadAllText("DataJson/subjects.json");
        List<Subject> subjects = JsonConvert.DeserializeObject<List<Subject>>(subjectsJson);

        return subjects;
    }
}
