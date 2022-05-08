using System.Security.Principal;
using System.Security.Claims;

namespace ProjectFTK.Extensions;

public static class IdentityExtensions
{
	public static string PictureUrl(this IIdentity identity)
	{
		return identity.ClaimValue(GoogleClaims.PictureUrl);
	}

	public static string ClaimValue(this IIdentity identity, string claimType)
	{
		return (identity as ClaimsIdentity)?.Claims?.FirstOrDefault(x => string.Equals(x.Type, claimType))?.Value ?? string.Empty;
	}
}

public class GoogleClaims
{
	public const string PictureUrl = "urn:google:picture";
}

