using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class User
{
	[JsonProperty("id")]
	public string Email { get; set; }

	public string Name { get; set; }

	public string PhotoUrl { get; set; }

	public List<string> ClassIds { get; set; }

	public List<Progress> ProgressList { get; set; }

	public List<LabProg> LabProgList { get; set; }
}

public class Progress
{
	public string LessonId { get; set; }

	public int Level { get; set; }

	public int ActiveSeconds { get; set; }

	public int Attempts { get; set; }
}

public class UpdateResponse
{
	public List<Progress> ProgressList { get; set; }

	public Progress UpdatedProgress { get; set; }
}

public class StudentAnalysis
{
	public string Name { get; set; }

	public string Email { get; set; }

	public string PhotoUrl { get; set; }

	public string Current { get; set; }

	public int Order { get; set; }

	public string Status { get; set; }

	public string Time { get; set; }
}

public class Submission
{
    public string Url { get; set; }

    public string State { get; set; }
}

public class LabProg
{
    public string Name { get; set; }

    public List<Submission> Submissions { get; set; }
}

public class UpdateLabProgResponse
{
    public List<LabProg> LabProgList { get; set; }

    public string CurrentLabName { get; set; }

    public int SubmissionIdx { get; set; }

	public string SubmissionUrl { get; set; }
}