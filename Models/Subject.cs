using System;
namespace ProjectFTK.Models
{
	public class Subject
	{
		public string SubjectSlug { get; set; }

		public string DisplayName { get; set; }

		public List<Course> Courses { get; set; }
	}
}