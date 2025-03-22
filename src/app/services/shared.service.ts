import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedService {

    private sharedValue = new BehaviorSubject('');
    private notificationValue = new BehaviorSubject(true);
    sharedMessage = this.sharedValue.asObservable();
    notificationMessage = this.notificationValue.asObservable();

    constructor() { }

    nextMessage(sharedValue: string) {
        this.sharedValue.next(sharedValue);
    }

    notificationCount() {
        this.notificationValue.next(true);
    }

}