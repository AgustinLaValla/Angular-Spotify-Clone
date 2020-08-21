import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { BehaviorSubject } from 'rxjs';
import { ScreenService } from './screensService';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SpotifyService {

    public token: string = null;
    public spotify = new SpotifyWebApi();
    public user: any;
    public isAuth = new BehaviorSubject<boolean>(false);
    public playlists$ = new BehaviorSubject<any>(null);
    public playlist$ = new BehaviorSubject<any>(null);
    public artistsList$ = new BehaviorSubject<any>(null);
    public albumList$ = new BehaviorSubject<any>(null);
    public playlistList$ = new BehaviorSubject<any>(null);
    public trackList$ = new BehaviorSubject<any>(null);
    public artistDetails$ = new BehaviorSubject<any>(null);
    public albumDetails$ = new BehaviorSubject<any>(null);
    public artistTopTracks$ = new BehaviorSubject<any>(null);
    public artistAlbums$ = new BehaviorSubject<any>(null);
    public myRecentlyPlayedTracks$ = new BehaviorSubject<any>(null);
    public featuredPlaylists$ = new BehaviorSubject<any>(null);
    public newRealises$ = new BehaviorSubject<any>(null);
    public followingArtist$ = new BehaviorSubject<any>(null);
    public followingPlaylist$ = new BehaviorSubject<any>(null);
    public currentTrack$ = new BehaviorSubject<any>(null);
    public viewAllImtesList$ = new BehaviorSubject<any>(null);
    public viewAllType: string;
    public deviceId: string;
    public query: string;
    public itemsOffset: number = 0;

    constructor(public screenService: ScreenService, private http: HttpClient) { }

    async getTokenFromUrl() {
        const urlQueriesObj = window.location.hash.substring(1).split('&').reduce((queriesObj: Object, item: string) => {
            const parts = item.split('=');
            queriesObj[parts[0]] = decodeURIComponent(parts[1]);
            return queriesObj;
        }, {});
        this.token = urlQueriesObj['access_token'];
        if (this.token) {
            window.location.hash = '';
            await this.spotify.setAccessToken(this.token);
            await this.isAuth.next(true);
            await this.screenService.currentScreen.next('Playlist');
            await this.getCurrentUser();
            await this.getListOfPlaylist();
            await this.getInitialPlaylist();
        } else {
            await this.isAuth.next(false);
        }
    }

    async getCurrentUser() {
        this.user = await this.spotify.getMe();
    }

    async getInitialPlaylist() {
        const playlist = await this.spotify.getPlaylist('37i9dQZEVXcGCEYfa5aelK');
        this.playlist$.next(playlist);
    }

    async getListOfPlaylist() {
        const playlists = await this.spotify.getUserPlaylists(this.user.id);
        this.playlists$.next(playlists);
    }

    async getPlaylist(playlistId: string) {
        const playlist = await this.spotify.getPlaylist(playlistId);
        this.playlist$.next(playlist);
        if (this.screenService.currentScreen.getValue() !== 'Playlist') {
            this.screenService.currentScreen.next('Playlist');
        }
    }

    async search(query: string) {
        this.query = query;
        const result = await this.spotify.search(query, ['artist', 'album', 'playlist', 'track'], { market: 'AR' });
        this.artistsList$.next(result.artists.items.slice(0, 6));
        this.albumList$.next(result.albums.items.slice(0, 6));
        this.playlistList$.next(result.playlists.items.slice(0, 6));
        this.trackList$.next(result.tracks.items.slice(0, 6));
        if (this.screenService.currentScreen.getValue() !== 'Search') {
            this.screenService.currentScreen.next('Search');
        }
    }

    async getArtist(artistId: string) {
        const result = await this.spotify.getArtist(artistId);
        this.artistDetails$.next(result);
    }

    async getAlbum(albumId: string) {
        const result = await this.spotify.getAlbum(albumId);
        this.albumDetails$.next(result);
    }

    async getArtistTopTracks(artistId: string) {
        const result = await this.spotify.getArtistTopTracks(artistId, 'US');
        this.artistTopTracks$.next(result.tracks);
    }

    async getArtistAlbums(artistId: string) {
        const result = await this.spotify.getArtistAlbums(artistId);
        this.artistAlbums$.next(result.items);
    }

    async getRecentlyPlayedTracks(viewAll: boolean = false) {
        if (!viewAll) {
            const result = await this.spotify.getMyRecentlyPlayedTracks({ limit: 6 });
            return this.myRecentlyPlayedTracks$.next(result.items.map(item => item.track));
        };
        const result = await this.spotify.getMyRecentlyPlayedTracks({ limit: 50 });
        await this.viewAllImtesList$.next(result.items.map(item => item.track));
    }

    async getFeaturedPlayLists(viewAll: boolean = false) {
        const result = await this.spotify.getFeaturedPlaylists({ limit: 20, offset: this.itemsOffset });
        if (!viewAll) {
            return this.featuredPlaylists$.next(result.playlists.items.slice(0, 6));
        }
        await this.viewAllImtesList$.next(result.playlists.items);
    }

    async getNewRealeases(viewAll: boolean = false) {
        const result = await this.spotify.getNewReleases({ limit: 20, offset: this.itemsOffset });
        if (!viewAll) {
            return this.newRealises$.next(result.albums.items.slice(0, 6));
        }
        await this.viewAllImtesList$.next(result.albums.items);
    }

    async isUserFollowingArtist(artistId: string) {
        const result = await this.spotify.isFollowingArtists([artistId]);
        const [following] = result;
        this.followingArtist$.next(following);
    }

    async followArtist(artistId: string) {
        await this.spotify.followArtists([artistId]);
        await this.isUserFollowingArtist(artistId);
    }

    async unFollowArtist(artistId: string) {
        await this.spotify.unfollowArtists([artistId]);
        await this.isUserFollowingArtist(artistId);
    }

    async isUserFollowingPlaylist(playlistId: string) {
        const result = await this.spotify.areFollowingPlaylist(playlistId, [this.user.id]);
        const [following] = result;
        this.followingPlaylist$.next(following);
    }

    async followPlaylist(playlistId: string) {
        await this.spotify.followPlaylist(playlistId);
        await this.isUserFollowingPlaylist(playlistId);
        await this.getListOfPlaylist()
    }

    async unFollowPlaylist(playlistId: string) {
        await this.spotify.unfollowPlaylist(playlistId);
        await this.isUserFollowingPlaylist(playlistId);
        await this.getListOfPlaylist()
    }

    async playTrack(body: SpotifyApi.PlayParameterObject) {
        await this.spotify.play(body);
    }

    setVolume(value: number) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`
        })
        this.http.put(
            `https://api.spotify.com/v1/me/player/volume?volume_percent=${value}&device_id=${this.deviceId}`,
            {},
            { headers }
        ).subscribe();
    }

    async viewAllItems(searchType: "album" | "artist" | "playlist" | "track") {
        try {
            const result = await this.spotify.search(this.query, [searchType], { limit: 20, offset: this.itemsOffset, market: 'AR' });
            const itemList = result.artists || result.albums || result.tracks || result.playlists;
            this.viewAllImtesList$.next([...itemList['items']]);

        } catch (error) {
            console.log(error);
        }
    }

}
