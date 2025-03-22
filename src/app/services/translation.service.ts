import { Injectable } from '@angular/core';
declare var require: any;

@Injectable({
  providedIn: 'root'
})

export class TranslationService {
  enJSON = require('../language/translation.en.json');
  currentLanguage = 'en';
  languageIndex = 0;
  translationFile: any;

  constructor() { }

  getTranslationFile() {
    this.translationFile = this.enJSON;
    this.languageIndex = 0;
  }

  getLocalizedString(keyName: any) {
    if (!keyName) { return keyName; }
    this.getTranslationFile();

    let result: any = this.translationFile[keyName];

    if (!result) {
      // result = this.getTranslationFile[keyName.toLowerCase()];
    }
    if (!result) {
      result = keyName;
    }

    return result;
  }

  getLocalizedStringCapitalize(keyName: any) {
    const result = this.getLocalizedString(keyName);
    return result[0].toUpperCase() + result.slice(1);
  }
}