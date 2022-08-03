using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;


public class Class : Course
{
	[JsonProperty("id")]
	public string Id { get; set; }

	public string Period { get; set; }

	public string? Code { get; set; }

	public string TeacherEmail { get; set; }

	public List<string> Users { get; set; }

	public int UserCount() => Users.Count();
}

public class Course
{
	public string CourseSlug { get; set; }

	public string DisplayName { get; set; }
}