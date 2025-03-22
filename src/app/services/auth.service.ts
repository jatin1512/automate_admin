import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localstorage: LocalStorageService) { }

  public isAuthenticated(): boolean {
    return !!this.localstorage.getLocalStore('atoken');
  }
}