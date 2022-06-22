using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;


public class Class : Course
{
	public string Period { get; set; }

	[JsonProperty("id")]
	public Guid Id { get; set; }

	public string? Code { get; set; }

	public string TeacherEmail { get; set; }

	public List<string> Students { get; set; }

	public int StudentCount() => Students.Count();
}

public class Course
{
	public string CourseSlug { get; set; }

	public string SubjectSlug { get; set; }

	public string DisplayName { get; set; }
}