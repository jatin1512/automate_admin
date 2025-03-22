import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent implements OnInit {
  private static readonly errorMessages: any = {
    email: (params: any, ctName: any) => `${ctName} must be a valid email address`,
    required: (params: any, ctName: any) => `${ctName} is required`,
    dateRangeInvalid: (params: any, ctName: any) => `${ctName} is invalid`,
    minlength: (params: { requiredLength: string; }) => 'The min number of characters is ' + params.requiredLength,
    maxlength: (params: { requiredLength: string; }) => 'The max allowed number of characters is ' + params.requiredLength,
    pattern: (params: { requiredPattern: string; }) => 'The required pattern is: ' + params.requiredPattern,
    patternInvalid: (params: { regexp: string; }) => 'The required pattern is: ' + params.regexp,
    years: (params: { message: any; }) => params.message,
    countryCity: (params: { message: any; }) => params.message,
    uniqueName: (params: { message: any; }) => params.message,
    telephoneNumbers: (params: { message: any; }) => params.message,
    telephoneNumber: (params: { message: any; }) => params.message
  };

  @Input()
  public control!: AbstractControlDirective | AbstractControl;

  @Input()
  public messages: any = {};

  @Input()
  public controlName: any;

  constructor() { }

  ngOnInit() {
    if (!this.controlName) {
      this.controlName = this.getControlName(this.control as FormControl);
    }
  }
  shouldShowErrors(): boolean {
    const isFormDirty = (this.control as FormControl).parent!.dirty;
    return this.control! &&
      this.control.errors! &&
      ((this.control.touched! && this.control.dirty! && isFormDirty!));
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors!)
      .map(field => this.getMessage(field, this.control.errors![field]));
  }

  private getControlName(c: AbstractControl): string | null {
    const formGroup: any = c.parent!.controls;
    const controlName = this.prettifyCamelCase(Object.keys(formGroup).find(name => c === formGroup[name]) || null);
    return controlName;
  }

  private getMessage(type: string, params: any) {
    return this.messages[type] || ValidationMessageComponent.errorMessages[type](params, this.controlName);
  }

  private prettifyCamelCase(str: any) {
    let output = '';
    const len = str.length;
    let char;

    for (let i = 0; i < len; i++) {
      char = str.charAt(i);

      if (i === 0) {
        output += char.toUpperCase();
      } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
        output += ' ' + char;
      } else if (char === '-' || char === '_') {
        output += ' ';
      } else {
        output += char;
      }
    }
    return output;
  }
}