import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { TranslationService } from '../../../services/translation.service';
import { SharedService } from '../../../services/shared.service';
import { DeleteConfirmationComponent } from '../../../shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-car-company-model-list',
  templateUrl: './car-company-model-list.component.html',
  styleUrls: ['./car-company-model-list.component.scss']
})
export class CarCompanyModelListComponent implements OnInit {

  public carCompanys: any;
  
  constructor(
    private httpService: HttpRequestsService,
    public translation: TranslationService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  async ngOnInit() {
    this.fetch();
  }

  onDelete(carCompany: { id: any; }) {
    const modalRef = this.modalService.show(DeleteConfirmationComponent);
    modalRef.content?.onClose.subscribe(async (isConfirmed: any) => {
      if (isConfirmed) {
        await this.httpService.delete(`/car/car-model/${carCompany.id}`);
        _.remove(this.carCompanys, (n: { id: any; }) => {
          return n.id === carCompany.id;
        });
        this.toastr.success(this.translation.getLocalizedString('DELETE_CARCOMPANYMODEL_SUCCESFULLY'));
      }
    });
  }

  public async fetch() {
    const res = await this.httpService.get('/car/all-car-model', {}) as any;
    this.carCompanys = res.data;
  }
}
