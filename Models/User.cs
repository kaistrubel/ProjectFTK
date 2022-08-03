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