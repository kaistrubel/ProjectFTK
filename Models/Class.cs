using System;
namespace ProjectFTK.Models;


public class Class : GenericClass
{
	public string Period { get; set; }

	public string Id { get; set; }

	public string Code { get; set; }

	public string TeacherEmail { get; set; }
}

public class GenericClass
{
	public string Slug { get; set; }

	public string DisplayName { get; set; }
}