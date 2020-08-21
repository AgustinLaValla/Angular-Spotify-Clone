import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';

@Component({
  selector: 'app-sidebar-option',
  templateUrl: './sidebar-option.component.html',
  styles: [
  ]
})
export class SidebarOptionComponent implements OnInit {

  @Input() public title:string;
  @Input() public icon:any;
  @Input() public pageName:string;
  @Input() public playlistId:string;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void { }

  async getPlaylist() {
    await this.spotifyService.getPlaylist(this.playlistId);
  }

  renderTo() {
    this.spotifyService.screenService.currentScreen.next(this.pageName);
    if(this.pageName === 'Home') {
      this.spotifyService.itemsOffset = 0;
      this.spotifyService.getRecentlyPlayedTracks();
      this.spotifyService.getFeaturedPlayLists();
      this.spotifyService.getNewRealeases();
    }
    if(this.pageName === 'Playlist') {
      this.spotifyService.getPlaylist('37i9dQZEVXcGCEYfa5aelK');
    }
  }

}
