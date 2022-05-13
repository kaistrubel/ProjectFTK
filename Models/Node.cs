using System;
namespace ProjectFTK.Models;

public class Node
{
	public string Name { get; set; }

	public string? Details { get; set; }

	public Guid Id { get; set; }

	public Guid? ParentId { get; set; }

	public int Order { get; set; }
}