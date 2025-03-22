import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit {

  public show: boolean;
  @ViewChild('email')
  email!: ElementRef;
  public token: any;
  constructor(
    private httpRequest: HttpRequestsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private localstorege: LocalStorageService,
    private toastr: ToastrService,
    public translation: TranslationService,
  ) {
    this.show = false;
  }

  public loginForm!: FormGroup;
  public isSubmitted = false;

  ngOnInit(): void {
    const token = this.localstorege.getLocalStore('atoken');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }

  ngAfterViewInit() {
    this.email.nativeElement.focus();
  }

  get formControls() { return this.loginForm.controls; }

  async login() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const res = await this.httpRequest.post('/user/signin', this.loginForm.getRawValue(), true) as any;
      console.log(res);
      if (res) {
        this.isSubmitted = false;
        this.localstorege.clearStorage();
        this.localstorege.setLocalStore('auserDetails', JSON.stringify(res.data.user));
        this.localstorege.setLocalStore('atoken', res.data.token);
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_LOGIN'));
        this.router.navigate(['/dashboard']);
      }
    }
  }

  password() {
    this.show = !this.show;
  }
}