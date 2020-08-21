import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styles: [
  ]
})
export class ArtistDetailsComponent implements OnInit, OnDestroy {

  private artistDetailsObs$ = new Subscription();
  private artistTropTracksObs$ = new Subscription();
  private artistAlbumsObs$ = new Subscription();
  private followingArtist$ = new Subscription();

  public artistDetails: any;
  public artistTopTracks: any;
  public artistAlbums: any;
  public following: boolean;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.getArtistDetails();
    this.getArtistTopTracks();
    this.getArtistAlbums();
    this.getIsUserFollowingArtist();
  }

  getArtistDetails() {
    this.artistDetailsObs$ = this.spotifyService.artistDetails$.pipe(
      filter(artistDetails => !isNullOrUndefined(artistDetails)),
      map(artistDetails => this.artistDetails = artistDetails)
    ).subscribe();
  }

  getArtistTopTracks() {
    this.artistTropTracksObs$ = this.spotifyService.artistTopTracks$.pipe(
      filter(topTracks => !isNullOrUndefined(topTracks)),
      map(topTracks => this.artistTopTracks = topTracks)
    ).subscribe();
  }

  getArtistAlbums() {
    this.artistAlbumsObs$ = this.spotifyService.artistAlbums$.pipe(
      filter(albums => !isNullOrUndefined(albums)),
      map(albums => this.artistAlbums = albums)
    ).subscribe()
  }

  getIsUserFollowingArtist() {
    this.followingArtist$ = this.spotifyService.followingArtist$.pipe(
      filter(following => !isNullOrUndefined(following)),
      map(following => this.following = following)
    ).subscribe();
  }

  async followingButtonClickHandler() {
    if (this.following) {
      await this.spotifyService.unFollowArtist(this.artistDetails.id);
    } else {
      await this.spotifyService.followArtist(this.artistDetails.id);
    }
  }

  onAlbumOver(album: any) {
    document.getElementById(album.id).style.opacity = '1';
  }

  onAlbumLeave(album: any) {
    document.getElementById(album.id).style.opacity = '0';
  }

  getAlbum(albumId: string) {
    this.spotifyService.getAlbum(albumId);
    this.spotifyService.screenService.currentScreen.next('AlbumDetails');
  }

  ngOnDestroy(): void {
    this.artistDetailsObs$.unsubscribe();
    this.artistTropTracksObs$.unsubscribe();
    this.artistAlbumsObs$.unsubscribe();
    this.followingArtist$.unsubscribe();
  }

}
