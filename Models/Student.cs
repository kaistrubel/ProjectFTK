using System;
using Newtonsoft.Json;

namespace ProjectFTK.Models
{
	public class Student
	{
		[JsonProperty("id")]
		public string Email { get; set; }

		public List<Guid> ClassIds { get; set; }
	}
}