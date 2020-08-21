import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../services/screensService';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  private currentScreenObs$ = new Subscription();
  public currentScreen: string;

  constructor(private screensService: ScreenService) { }

  ngOnInit(): void {
    this.getCurrentScreen();
  }

  getCurrentScreen() {
    this.currentScreenObs$ = this.screensService.currentScreen.pipe(
      filter(currentScreen => !isNullOrUndefined(currentScreen)),
      map(currentScreen => this.currentScreen = currentScreen)
    ).subscribe();
  }

  onScroll(ev) {
    if(ev === 'bottom') {
      this.screensService.scrollPosition.emit(ev);
    }
  }

  ngOnDestroy(): void {
    this.currentScreenObs$.unsubscribe();
  }

}
