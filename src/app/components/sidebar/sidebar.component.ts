import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  private playlistObs$ = new Subscription();
  public playlists: any;

  constructor(private spotify: SpotifyService) { }

  ngOnInit() {
    this.getPlaylists();
  }

  getPlaylists() {
    this.playlistObs$ = this.spotify.playlists$.pipe(
      filter(list => !isNullOrUndefined(list)),
      map(list => this.playlists = list)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.playlistObs$.unsubscribe();
  }

}
