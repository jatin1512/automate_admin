import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  setLocalStore(key: string, data: string) {
    return localStorage.setItem(key, data);
  }

  getLocalStore(key: string) {
    return localStorage.getItem(key);
  }

  clearStorageFor(key: string) {
    return localStorage.removeItem(key);
  }

  clearStorage() {
    return localStorage.clear();
  }
}