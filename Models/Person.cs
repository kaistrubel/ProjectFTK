using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models
{
	public class Person
	{
		[JsonProperty("id")]
		public string Email { get; set; }

		public string Name { get; set; }

		public string PhotoUrl { get; set; }

		public List<string> ClassIds { get; set; }

		public List<Progress> Progress { get; set; }
	}

	public class Progress
	{
		public string LessonId { get; set; }

		public int Level { get; set; }

		public string TimeSpent { get; set; }
	}

	public class UpdateResponse
	{
		public Person User { get; set; }

		public Progress UpdatedProgress { get; set; }
	}
}