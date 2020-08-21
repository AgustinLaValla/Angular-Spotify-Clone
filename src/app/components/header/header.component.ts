import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public query: string

  constructor(public spotifyService: SpotifyService) { }

  ngOnInit(): void { }

  search() {
    this.spotifyService.search(this.query);
  }

}
