import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { TranslationService } from '../../../services/translation.service';
import { SharedService } from '../../../services/shared.service';
import { DeleteConfirmationComponent } from '../../../shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  public carCompanys: any;
  public mediaUrl = environment.MEDIA_URL;
  
  constructor(
    private httpService: HttpRequestsService,
    public translation: TranslationService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    this.fetch();
  }

  onDelete(carCompany: { id: any; }) {
    const modalRef = this.modalService.show(DeleteConfirmationComponent);
    modalRef.content?.onClose.subscribe(async (isConfirmed: any) => {
      if (isConfirmed) {
        await this.httpService.delete(`/car/delete-admin-car/${carCompany.id}`);
        _.remove(this.carCompanys, (n: { id: any; }) => {
          return n.id === carCompany.id;
        });
        this.toastr.success(this.translation.getLocalizedString('DELETE_CAR_SUCCESFULLY'));
      }
    });
  }

  public async fetch() {
    const res = await this.httpService.get('/car/admin-car', {}) as any;
    this.carCompanys = res.data;
  }
}
