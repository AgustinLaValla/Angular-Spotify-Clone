import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';


@Injectable({providedIn: 'root'})
export class ScreenService {

    public currentScreen = new BehaviorSubject<string>('');
    public authObs$ = new Subscription();
    public scrollPosition = new EventEmitter<string>();

    public viewAllTitle:string;

    constructor() { }
    
}