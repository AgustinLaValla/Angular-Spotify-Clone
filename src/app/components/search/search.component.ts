import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  public artistsListobs$: Observable<any>;
  public albumsListobs$: Observable<any>;
  public playlistsListobs$: Observable<any>;
  public tracksListobs$: Observable<any>;

  constructor(private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.getArtistList();
    this.getAlbumsList();
    this.getPlaylistsList();
    this.getTrackList();
  }

  getArtistList() {
    this.artistsListobs$ = this.spotifyService.artistsList$;
  }

  getAlbumsList() {
    this.albumsListobs$ = this.spotifyService.albumList$;
  }
  getPlaylistsList() {
    this.playlistsListobs$ = this.spotifyService.playlistList$;
  }
  getTrackList() {
    this.tracksListobs$ = this.spotifyService.trackList$;
  }
}
