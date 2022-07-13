using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class Lesson
{
	public string Unit { get; set; }

	public string Name { get; set; }

	public int Order { get; set; }

	public string CourseSlug { get; set; }

	public List<Problem> Problems { get; set; }

	[JsonProperty("id")]
	public string LessonSlug => Name.ToLower().Replace(" ", "-");
}

public class Problem
{
	public string Url { get; set; }

	public int Level { get; set; } //map concept to 0? 1- > beginner, 2-> medium, 3->hard

	public float Gain { get; set; }

	public List<Video> Videos { get; set; } //list of notes too

}

public class Video
{
	public string Url { get; set; }

	public float Gain { get; set; }
}

public class LessonsJson
{
	public Dictionary<string, List<string>> Units;
}