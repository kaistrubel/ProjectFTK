using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class LessonInfo
{
	public string Unit { get; set; }

	public string LessonId { get; set; }

	public string Name { get; set; }

	public int Order { get; set; }

	public int Days { get; set; }

	public string CourseSlug { get; set; }
}

public class Lesson
{
	[JsonProperty("id")]
	public string LessonId { get; set; }

	public List<Problem> Problems { get; set; } //list of notes too

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