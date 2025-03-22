import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public translation: TranslationService,
    private localstorege: LocalStorageService,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }


  logout() {
    this.localstorege.clearStorageFor('auserDetails');
    this.localstorege.clearStorageFor('atoken');
    this.toastr.success(this.translation.getLocalizedString('LOGOUT_SUCCESSFULLY'));
    this.router.navigate(['/auth/login']);
  }

}