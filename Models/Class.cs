using System;
namespace ProjectFTK.Models;


public class Class : GenericClass
{
	public string ClassId { get; set; }

	public string DisplayName { get; set; }
}

public class GenericClass
{
	public string Slug { get; set; }

	public string DisplayName { get; set; }
}