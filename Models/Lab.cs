using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models;

public class Lab
{
	public string Unit { get; set; }

	public string Name { get; set; }

    public string ManualUrl { get; set; }

    public string VideoUrl { get; set; }

    public int Order { get; set; }

	public List<string> Submissions { get; set; }
}