import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarOptionComponent } from './components/sidebar-option/sidebar-option.component';
import { SongRowComponent } from './components/song-row/song-row.component';
import { SearchComponent } from './components/search/search.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { AlbumDetailsComponent } from './components/album-details/album-details.component';
import { PlayIconVisibilityDirective } from './directives/play-icon-visibility.directive';
import { HomeComponent } from './components/home/home.component';
import { ViewAllComponent } from './components/view-all/view-all.component';
import { ScrollableDirective } from './directives/scrollable.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    PlaylistComponent,
    HeaderComponent,
    FooterComponent,
    SidebarOptionComponent,
    SongRowComponent,
    SearchComponent,
    ItemListComponent,
    ArtistDetailsComponent,
    AlbumDetailsComponent,
    PlayIconVisibilityDirective,
    HomeComponent,
    ViewAllComponent,
    ScrollableDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
