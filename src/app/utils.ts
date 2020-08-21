export const clientId = "e0350e15f4944046926a1b4425e62d59";
export const authEndPoint = 'https://accounts.spotify.com/authorize';
export const redirectUri = "https://angular-spotify-clone.vercel.app/";

const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "user-follow-read",
    'user-follow-modify',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private'
];

export const loginUrl = `${authEndPoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
)}&response_type=token&show_dialog=true`;