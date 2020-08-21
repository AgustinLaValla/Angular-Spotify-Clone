import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify-service';
import { map, filter, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-song-row',
  templateUrl: './song-row.component.html',
  styles: [
  ]
})
export class SongRowComponent implements OnInit, OnDestroy {

  @Input() track: any;
  @Input() albumImage: any;
  @Input() albumName: any;

  private currentScreenObs$ = new Subscription();
  private playlist$ = new Subscription();
  private albumDetails$ = new Subscription();
  private artistTopTracksObs$ = new Subscription();
  private currentTrackObs$ = new Subscription();

  private currentScreen: string;
  private playlist: any;
  private albumDetails: any;
  private artistTopTracks: any;
  public currentTrack: any;

  constructor(public spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.getCurrentScreen();
    this.getAlbumDetails();
    this.getCurrentPlayList();
    this.getArtistTopTracks();
    this.getCurrentTrackId();
  }

  getImage() {
    return this.albumImage ? this.albumImage : this.track.album.images[0].url;
  }

  getArtistsNames() {
    return `${this.track.artists.map(artist => artist.name).join(', ')} - ${this.albumName ? this.albumName : this.track.album.name}`
  }

  playTrack() {
    switch (this.currentScreen) {
      case 'Playlist':
        this.spotifyService.playTrack({
          context_uri: this.playlist.uri as string,
          device_id: this.spotifyService.deviceId,
          offset: { uri: this.track.uri }
        });
        break;

      case 'AlbumDetails':
        this.spotifyService.playTrack({
          context_uri: this.albumDetails.uri,
          device_id: this.spotifyService.deviceId,
          offset: { position: this.track.track_number - 1 }
        })
        break;

      case 'ArtistDetails':
        const tracksArray = this.artistTopTracks.map(track => track.uri);
        this.spotifyService.playTrack({
          uris: tracksArray,
          device_id: this.spotifyService.deviceId,
          offset: { uri: this.track.uri }
        })
        break;
      default: return;
    }

  }

  getCurrentScreen() {
    this.currentScreenObs$ = this.spotifyService.screenService.currentScreen.pipe(
      filter(screen => screen !== null && screen !== undefined),
      map(screen => this.currentScreen = screen)
    ).subscribe();
  }

  getCurrentPlayList() {
    this.playlist$ = this.spotifyService.playlist$.pipe(
      filter(playlist => !isNullOrUndefined(playlist)),
      map(playlist => this.playlist = playlist)
    ).subscribe();
  }

  getAlbumDetails() {
    this.albumDetails$ = this.spotifyService.albumDetails$.pipe(
      filter(albumDetails => !isNullOrUndefined(albumDetails)),
      map(albumDetails => this.albumDetails = albumDetails)
    ).subscribe();
  }


  getArtistTopTracks() {
    this.artistTopTracksObs$ = this.spotifyService.artistTopTracks$.pipe(
      filter(tracks => !isNullOrUndefined(tracks)),
      map(tracks => this.artistTopTracks = tracks)
    ).subscribe();
  }

  getCurrentTrackId() {
    this.currentScreenObs$ = this.spotifyService.currentTrack$.pipe(
      map(id => this.currentTrack = id),
    ).subscribe();
  }

  getRowClass() {
    if (!this.track || !this.currentTrack || this.track.id !== this.currentTrack.id) {
      return 'songRowIsNotBeingPlayed';
    } else {
      return 'songRowIsBeingPlayed';
    }
  }

  ngOnDestroy() {
    this.currentScreenObs$.unsubscribe();
    this.playlist$.unsubscribe();
    this.albumDetails$.unsubscribe();
    this.artistTopTracksObs$.unsubscribe();
    this.currentTrackObs$.unsubscribe();
  }

}
