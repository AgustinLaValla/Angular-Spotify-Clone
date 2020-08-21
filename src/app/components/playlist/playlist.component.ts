import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify-service';
import { filter, map, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styles: [
  ]
})
export class PlaylistComponent implements OnInit, OnDestroy {

  private playlistObs$ = new Subscription();
  private followingPlaylistObs$ = new Subscription();
  public playlist: any;
  public isFollowingPlaylist: boolean = false;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.getCurrentPlayList();
    this.getIsUserFollowingPlaylist();
  }

  getCurrentPlayList() {
    this.playlistObs$ = this.spotifyService.playlist$.pipe(
      filter(playlist => !isNullOrUndefined(playlist)),
      map(playlist => this.playlist = playlist),
      tap(() => this.spotifyService.isUserFollowingPlaylist(this.playlist.id))
    ).subscribe();
  }

  getIsUserFollowingPlaylist() {
    this.followingPlaylistObs$ = this.spotifyService.followingPlaylist$.pipe(
      filter(following => !isNullOrUndefined(following)),
      map(following => this.isFollowingPlaylist = following),
    ).subscribe(console.log);
  }

  async handleFollowingButtonClick() {
    if (this.isFollowingPlaylist) {
      await this.spotifyService.unFollowPlaylist(this.playlist.id)
    } else {
      await this.spotifyService.followPlaylist(this.playlist.id);
    }
  }

  handleShuffleButtonClick() {
    this.spotifyService.playTrack({
      context_uri: this.playlist.uri,
      device_id: this.spotifyService.deviceId,
      offset: { position: Math.round(Math.random() * this.playlist.tracks.items.length -  1) }
    })
  }


  ngOnDestroy(): void {
    this.playlistObs$.unsubscribe();
    this.followingPlaylistObs$.unsubscribe();
  }

}
