using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class Lecture
{
	public List<string> Problems { get; set; }

	public List<string> Videos { get; set; }

	public List<string> Notes { get; set; }
}
/*
public class Lecture
{
	[JsonProperty("id")]
	public Guid Id { get; set; }

	public List<Problem> Problems { get; set; }

	public List<Uri> Videos { get; set; }

	public List<Uri> Notes { get; set; }

	public int Level { get; set; }
}

public class Problem
{
	public string Question { get; set; }

	public string Answer { get; set; }
}
*/