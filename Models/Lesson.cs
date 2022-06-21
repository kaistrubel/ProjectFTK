using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class Lesson
{
	public string Name { get; set; }

	public string Unit { get; set; }

	public Dictionary<int, Guid> Examples { get; set; }

	public Guid Concept { get; set; }

	[JsonProperty("id")]
	public string Slug => Name.ToLower().Replace(" ", "-");
}