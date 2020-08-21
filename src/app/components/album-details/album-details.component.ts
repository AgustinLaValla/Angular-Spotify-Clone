import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styles: [
  ]
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {

  private albumDetailsObs$ = new Subscription();
  public albumDetails: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.getAlbumDetails();
  }

  getAlbumDetails() {
    this.albumDetailsObs$ = this.spotifyService.albumDetails$.pipe(
      filter(album => !isNullOrUndefined(album)),
      map(album => this.albumDetails = album)
    ).subscribe();
  }

  getAlbumArtistsNames() {
    return this.albumDetails.artists.map(artist => artist.name).join(' ');
  }

  getAlbumDuration() {
    const durationInMiliseconds = this.albumDetails.tracks.items.reduce((acumulator, track) => acumulator + track.duration_ms, 0);
    const durationFomatted = moment.utc(moment.duration(durationInMiliseconds / 1000, 'seconds').asMilliseconds()).format("HH:mm:ss");
    return durationFomatted.split(':').map((unit, index) => {
      if (index === 0) {
        return Number(unit) > 0 ? `${unit} h` : null;
      } else if (index === 1) {
        return `${unit} min`;
      } else {
        return `${unit} s`;
      }
    }).join(' ');
  }

  ngOnDestroy(): void {
    this.albumDetailsObs$.unsubscribe();
  }

}
