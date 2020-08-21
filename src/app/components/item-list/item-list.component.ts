import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styles: [
  ]
})
export class ItemListComponent implements OnInit, OnDestroy {

  @Input() itemList: string;
  @Input() title: string;
  @Input() itemType: string

  private scrollPositionObs$ = new Subscription();
  private currentScreenObs$ = new Subscription();
  private currentScreen: string;

  constructor(public spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.onScrollBottomListener();
    this.currentScreenListener();
    console.log(this.itemList);
  }

  currentScreenListener() {
    this.currentScreenObs$ = this.spotifyService.screenService.currentScreen.pipe(
      filter(screen => !isNullOrUndefined(screen)),
      map(screen => this.currentScreen = screen)
    ).subscribe();
  }

  onScrollBottomListener() {
    this.scrollPositionObs$ = this.spotifyService.screenService.scrollPosition.pipe(
      tap((ev) => this.currentScreen === 'ViewAll' ? this.loadMoreItems() : 'Nothing')
    ).subscribe();
  }


  getImage(item: any) {
    if (this.itemType !== 'RecentlyPlayed' && this.itemType !== 'Tracklist') {
      return item.images[0]?.url
    } else {
      return item.album.images[0]?.url;
    }
  }

  onCardMouseOverHandler(id: string) {
    document.getElementById(id).classList.add('icon-display-inline');
  }

  onCardMouseLeaveHandler(id: string) {
    document.getElementById(id).classList.remove('icon-display-inline');
  }


  renderToItemDetails(item: any) {
    const itemId = this.getItemId(item);
    if (this.itemType && this.itemType === 'Artist') {

      this.spotifyService.screenService.currentScreen.next('ArtistDetails');
      this.spotifyService.getArtist(itemId);
      this.spotifyService.getArtistTopTracks(itemId);
      this.spotifyService.getArtistAlbums(itemId);
      this.spotifyService.isUserFollowingArtist(itemId);

    } else if (this.itemType && (this.itemType === 'Albums' || this.itemType === 'RecentlyPlayed' || this.itemType === 'Tracklist')) {

      this.spotifyService.screenService.currentScreen.next('AlbumDetails');
      this.spotifyService.getAlbum(itemId);
      if (this.itemType === 'RecentlyPlayed' || this.itemType === 'Tracklist') {
        this.spotifyService.playTrack({
          device_id: this.spotifyService.deviceId,
          context_uri: item.album.uri,
          offset: { 'position': item.track_number - 1 }
        });
      }

    } else if (this.itemType && this.itemType === 'Playlist') {

      this.spotifyService.screenService.currentScreen.next('AlbumDetails');
      this.spotifyService.getPlaylist(itemId);
    }
  }

  getItemId(item: any) {
    return this.itemType !== 'RecentlyPlayed' && this.itemType !== 'Tracklist' ? item.id : item.album.id;
  }

  async playIconClickHandler(item) {
    if (item.type === 'album' || item.type === 'playlist') {
      return await this.spotifyService.playTrack({
        context_uri: item.uri,
        offset: { position: Math.round(Math.random() * this.itemList.length - 1) }
      })
    }
  }


  async viewAll() {
    this.spotifyService.itemsOffset = 0;

    if (this.itemType === 'RecentlyPlayed') {
      this.spotifyService.screenService.viewAllTitle = 'Recently Played';
      this.spotifyService.viewAllType = this.itemType;
      await this.spotifyService.getRecentlyPlayedTracks(true);
      await this.spotifyService.screenService.currentScreen.next('ViewAll');
      return;
    }

    if (this.title === 'Featured Playlists') {
      this.spotifyService.viewAllType = this.itemType;
      this.spotifyService.screenService.viewAllTitle = 'Featured Playlists';
      await this.spotifyService.getFeaturedPlayLists(true);
      await this.spotifyService.screenService.currentScreen.next('ViewAll');
      return;
    }

    if (this.title === 'New Realeases') {
      this.spotifyService.viewAllType = this.itemType;
      this.spotifyService.screenService.viewAllTitle = 'New Realeases';
      await this.spotifyService.getNewRealeases(true);
      await this.spotifyService.screenService.currentScreen.next('ViewAll');
      return;
    }

    const type: "album" | "artist" | "playlist" | "track" = this.itemType === 'Artist' ? 'artist'
      : this.itemType === 'Albums' ? 'album'
        : this.itemType === 'Playlist' ? 'playlist'
          : this.itemType === 'Tracklist' ? 'track' : null;
    this.spotifyService.viewAllType = this.itemType;
    this.spotifyService.screenService.viewAllTitle = this.itemType === 'Artist' ? 'Artists'
      : this.itemType === 'Albums' ? 'Albums'
        : this.itemType === 'Playlist' ? 'Playlists'
          : this.itemType === 'Tracklist' ? 'Tracklist'
            : null;
    await this.spotifyService.viewAllItems(type);
    await this.spotifyService.screenService.currentScreen.next('ViewAll')
  }

  async loadMoreItems() {

    this.spotifyService.itemsOffset += 20;

    if (this.itemType === 'RecentlyPlayed') {
      if(this.itemList.length >=  50) {
        return
      }
      await this.spotifyService.getRecentlyPlayedTracks(true);
      return;
    }

    if (this.title === 'Featured Playlists') {
      await this.spotifyService.getFeaturedPlayLists(true);
      return;
    }

    if (this.title === 'New Realeases') {
      await this.spotifyService.getNewRealeases(true);
      return;
    }


    const type: "album" | "artist" | "playlist" | "track" = this.itemType === 'Artist' ? 'artist'
      : this.itemType === 'Albums' ? 'album'
        : this.itemType === 'Playlist' ? 'playlist'
          : this.itemType === 'Tracklist' ? 'track' : null;

    await this.spotifyService.viewAllItems(type);


  }

  ngOnDestroy(): void {
    this.scrollPositionObs$.unsubscribe();
    this.currentScreenObs$.unsubscribe();
  }

}

