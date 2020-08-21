import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public recentlyPlayedTracks$: Observable<any>;
  public featuredPlaylists$: Observable<any>;
  public newRealeases$: Observable<any>

  constructor(private spotifyService:SpotifyService) { }

  ngOnInit(): void {
    this.recentlyPlayedTracks$ = this.spotifyService.myRecentlyPlayedTracks$;
    this.featuredPlaylists$ = this.spotifyService.featuredPlaylists$;
    this.newRealeases$ = this.spotifyService.newRealises$;
  }

}
