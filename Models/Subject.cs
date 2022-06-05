using System;
namespace ProjectFTK.Models
{
	public class Subject
	{
		public string Slug { get; set; }

		public string DisplayName { get; set; }

		public List<GenericClass> Classes { get; set; }
	}
}

