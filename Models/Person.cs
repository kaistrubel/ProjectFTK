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
	}
}