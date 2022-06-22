using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class Lesson
{
	public string Name { get; set; }

	public string Unit { get; set; }

	public string CourseSlug { get; set; }

	//map concept to 0
	public Dictionary<int, Guid> Lectures { get; set; }

	[JsonProperty("id")]
	public string LessonSlug => Name.ToLower().Replace(" ", "-");
}

public class LessonsJson
{
	public Dictionary<string, List<string>> Units;
}