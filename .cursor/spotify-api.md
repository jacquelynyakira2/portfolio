# Prerequisites
This tutorial assumes you have a Spotify account (free or premium).
We will use cURL to make API calls. You can install it from here our using the package manager of your choice.


# The Client ID can be found here. The Client Secret can be found behind the View client secret link.

With our credentials in hand, we are ready to request an access token. This tutorial uses the Client Credentials, so we must:

Send a POST request to the token endpoint URI.
Add the Content-Type header set to the application/x-www-form-urlencoded value.
Add a HTTP body containing the Client ID and Client Secret, along with the grant_type parameter set to client_credentials.
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"

The response will return an access token valid for 1 hour:

{
  "access_token": "BQDBKJ5eo5jxbtpWjVOj7ryS84khybFpP_lTqzV7uV-T_m0cTfwvdn5BnBSKPxKgEb11",
  "token_type": "Bearer",
  "expires_in": 3600
}

Request artist data
For this example, we will use the Get Artist endpoint to request information about an artist. According to the API Reference, the endpoint needs the Spotify ID of the artist.

An easy way to get the Spotify ID of an artist is using the Spotify Desktop App:

Search the artist
Click on the three dots icon from the artist profile
Select Share > Copy link to artist. The Spotify ID is the value that comes right after the open.spotify.com/artist URI.
Our API call must include the access token we have just generated using the Authorization header as follows:

curl "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb" \
     -H "Authorization: Bearer  BQDBKJ5eo5jxbtpWjVOj7ryS84khybFpP_lTqzV7uV-T_m0cTfwvdn5BnBSKPxKgEb11"

If everything goes well, the API will return the following JSON response:

{
  "external_urls": {
    "spotify": "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb"
  },
  "followers": {
    "href": null,
    "total": 7625607
  },
  "genres": [
    "alternative rock",
    "art rock",
    "melancholia",
    "oxford indie",
    "permanent wave",
    "rock"
  ],
  "href": "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb",
  "id": "4Z8W4fKeB5YxbusRsdQVPb",
  "images": [
    {
      "height": 640,
      "url": "https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd",
      "width": 640
    },
    {
      "height": 320,
      "url": "https://i.scdn.co/image/ab67616100005174a03696716c9ee605006047fd",
      "width": 320
    },
    {
      "height": 160,
      "url": "https://i.scdn.co/image/ab6761610000f178a03696716c9ee605006047fd",
      "width": 160
    }
  ],
  "name": "Radiohead",
  "popularity": 79,
  "type": "artist",
  "uri": "spotify:artist:4Z8W4fKeB5YxbusRsdQVPb"
}

Congratulations! You made your first API call to the Spotify Web API.