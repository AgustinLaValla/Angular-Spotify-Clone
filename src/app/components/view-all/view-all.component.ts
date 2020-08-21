import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styles: [
  ]
})
export class ViewAllComponent implements OnInit, OnDestroy {

  private viewAllItemsListObs$ = new Subscription();
  public viewAllItemsList: any = [];

  constructor(public spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.getViewAllItemList();
  }

  getViewAllItemList() {
    this.viewAllItemsListObs$ = this.spotifyService.viewAllImtesList$.pipe(
      filter(data => !isNullOrUndefined(data)),
      tap(data => {
        if (this.spotifyService.screenService.viewAllTitle !== 'Recently Played') {
          this.viewAllItemsList = [...this.viewAllItemsList, ...data];
        } else {
          this.viewAllItemsList = data;
        }
      }),
    ).subscribe(console.log);

  }

  ngOnDestroy(): void {
    this.viewAllItemsListObs$.unsubscribe();
    this.viewAllItemsList = [];
  }

}
