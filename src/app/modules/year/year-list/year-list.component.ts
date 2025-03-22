import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { TranslationService } from '../../../services/translation.service';
import { SharedService } from '../../../services/shared.service';
import { DeleteConfirmationComponent } from '../../../shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-year-list',
  templateUrl: './year-list.component.html',
  styleUrls: ['./year-list.component.scss']
})
export class YearListComponent implements OnInit {

  public years: any;
  
  constructor(
    private httpService: HttpRequestsService,
    public translation: TranslationService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.fetch();
  }

  onDelete(year: { id: any; }) {
    const modalRef = this.modalService.show(DeleteConfirmationComponent);
    modalRef.content?.onClose.subscribe(async (isConfirmed: any) => {
      if (isConfirmed) {
        await this.httpService.delete(`/car/model-year/${year.id}`);
        _.remove(this.years, (n: { id: any; }) => {
          return n.id === year.id;
        });
        this.toastr.success(this.translation.getLocalizedString('DELETE_YEAR_SUCCESFULLY'));
      }
    });
  }

  public async fetch() {
    const res = await this.httpService.get('/car/model-year', {}) as any;
    this.years = res.data;
  }
}
