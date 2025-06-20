import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; // Or the current recommended Deno std version
import "https://deno.land/x/xhr@0.3.0/mod.ts"; // Polyfill for XMLHttpRequest if needed by libraries, often not for direct fetch

const INSTAGRAM_API_URL = "https://graph.instagram.com/me/media";
const FIELDS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
// Consider how many posts to fetch, Instagram API defaults to 25, can use 'limit' query param
const POST_LIMIT = 9; // Fetch recent 9 posts

console.log("fetch-instagram-feed function initializing");

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // Adjust for specific domain in production
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const accessToken = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
    if (!accessToken) {
      console.error("INSTAGRAM_ACCESS_TOKEN is not set.");
      return new Response(
        JSON.stringify({ error: "Instagram Access Token not configured." }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const apiUrl = `${INSTAGRAM_API_URL}?fields=${FIELDS}&access_token=${accessToken}&limit=${POST_LIMIT}`;

    console.log(`Fetching from Instagram API: ${INSTAGRAM_API_URL}?fields=${FIELDS}&limit=${POST_LIMIT}`); // Log without token

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Error fetching from Instagram API:", response.status, errorData);
      return new Response(
        JSON.stringify({ error: "Failed to fetch data from Instagram.", details: errorData }),
        { status: response.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const data = await response.json();
    console.log("Successfully fetched data from Instagram API.");

    // Filter for IMAGE and CAROUSEL_ALBUM, and extract relevant fields
    // For CAROUSEL_ALBUM, thumbnail_url can be used if media_url is not directly an image.
    // Or, if children are needed, another API call might be required for carousel items.
    // For simplicity, we'll use media_url if it's an image, or thumbnail_url for videos/carousels as a fallback.
    const posts = data.data
      .map((post: any) => ({
        id: post.id,
        caption: post.caption || "",
        media_type: post.media_type,
        media_url: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url, // Prefer thumbnail for video
        permalink: post.permalink,
        timestamp: post.timestamp,
      }))
      .slice(0, POST_LIMIT); // Ensure we only return up to POST_LIMIT

    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, // Adjust CORS for production
    });

  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error.", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});

console.log(`fetch-instagram-feed function started. Waiting for requests...`);
// IMPORTANT: This function requires the INSTAGRAM_ACCESS_TOKEN environment variable to be set in your Supabase project.
// This token should be a valid Instagram User Access Token with 'user_profile' and 'user_media' permissions.
