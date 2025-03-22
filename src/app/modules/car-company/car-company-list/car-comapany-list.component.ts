import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { TranslationService } from '../../../services/translation.service';
import { DeleteConfirmationComponent } from '../../../shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-car-company-list',
  templateUrl: './car-company-list.component.html',
  styleUrls: ['./car-company-list.component.scss']
})
export class CarCompanyListComponent implements OnInit {

  public carCompanys: any;
  
  constructor(
    private httpService: HttpRequestsService,
    public translation: TranslationService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {}

  async ngOnInit() {
    this.fetch();
  }

  onDelete(carCompany: { id: any; }) {
    const modalRef = this.modalService.show(DeleteConfirmationComponent);
    modalRef.content?.onClose.subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        await this.httpService.delete(`/car/car-company/${carCompany.id}`);
        _.remove(this.carCompanys, (n: { id: any; }) => {
          return n.id === carCompany.id;
        });
        this.toastr.success(this.translation.getLocalizedString('DELETE_CARCOMPANY_SUCCESFULLY'));
      }
    });
  }

  public async fetch() {
    const res = await this.httpService.get('/car/car-company', {}) as any;
    this.carCompanys = res.data;
  }
}
