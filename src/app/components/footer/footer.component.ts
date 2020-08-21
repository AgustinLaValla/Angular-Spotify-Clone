import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from '../../services/spotify-service';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import '@material/mwc-slider';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent implements OnInit, OnDestroy {

  private isAuthObs$ = new Subscription();
  public player: any;
  private interval: any;
  public currentTrack: any;

  constructor(
    private spotifyService: SpotifyService,
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.isAuthObs$ = this.spotifyService.isAuth.pipe(
      tap(isAuth => {
        if (isAuth) {
          this.playbackInterval();
        }
      })
    ).subscribe();

  }

  checkForPlayer() {
    if ((window as any).Spotify) {
      clearInterval(this.interval);
      this.player = new (window as any).Spotify.Player({
        name: 'Angular Spotify clone',
        getOAuthToken: (cb) => cb(this.spotifyService.token),
        volume: 1
      });
      this.setPlayerListeners();
    }
  }

  playbackInterval() {
    this.interval = setInterval(() => this.checkForPlayer());
  }

  transferPlaybackHere(device_id: string) {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.spotifyService.token}`,
      "Content-Type": 'application/json'
    });
    this.http.put('https://api.spotify.com/v1/me/player',
      { 'device_ids': [device_id], 'play': true },
      { headers }
    ).subscribe(console.log);
  }

  setPlayerListeners() {
    this.player.addListener('ready', ({ device_id }) => {
      this.transferPlaybackHere(device_id);
      this.spotifyService.deviceId = device_id;
    });
    this.player.connect().then();
    setInterval(async () => {
      this.currentTrack = await this.player.getCurrentState();
      if (this.currentTrack) {
        this.spotifyService.currentTrack$.next(this.currentTrack?.track_window.current_track);
      }
    }, 1000);
  }

  setImage() {
    return this.currentTrack &&
      this.currentTrack.track_window &&
      this.currentTrack.track_window.current_track &&
      this.currentTrack.track_window.current_track.album.images
      ? this.currentTrack.track_window.current_track.album.images[0].url
      : null;
  }

  getArtistsNames() {
    const names = this.currentTrack.track_window.current_track.artists.map(artist => artist.name).join(' ');
    return names.length > 15 ? names.slice(0, 15) + '...' : names;
  }

  getTrackName() {

    const { track_window: { current_track: { name } } } = this.currentTrack;
    return name && name.length > 15 ? name.slice(0, 15) + '...' : name;

  }

  togglePlay() {
    this.player.togglePlay();
  }

  async setVolume(value: number) {
    await this.spotifyService.setVolume(Math.round(value));
  }

  ngOnDestroy() {
    this.isAuthObs$.unsubscribe();
  }

}
