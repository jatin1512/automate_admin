import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { FormService } from '../../../shared/validation-message/form.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-add-edit-car-company',
  templateUrl: './add-edit-car-company.component.html',
  styleUrls: ['./add-edit-car-company.component.scss']
})
export class AddEditCarCompanyComponent implements OnInit {

  public form!: FormGroup;
  public carCompanyId: any;
  public isLoading: any;

  constructor(
    private httpRequest: HttpRequestsService,
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private translation: TranslationService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.carCompanyId = this.route.snapshot.params['id'];
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
    this.getYear();
  }

  async getYear() {
    this.form.disable();
    if (this.carCompanyId) {
      const carCompaanyDetails = await this.httpRequest.get(`/car/car-company/${this.carCompanyId}`) as any;
      this.form.patchValue({
        name: carCompaanyDetails.data.name
      });
    }
    this.form.enable();
  }

  get formControls() {
    return this.form.controls;
  }

  async addCarCompany() {
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.carCompanyId) {
        await this.httpRequest.post(`/car/edit-car-company/${this.carCompanyId}`, { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESFULLY_CARCOMPANY_UPDATED'));
      } else {
        await this.httpRequest.post('/car/add-car-company', { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_CARCOMPANY_ADDED'));
      }
      this.router.navigate(['/car-company']);
    }
  }

  public cancel() {
    this.router.navigate(['/car-company']);
  }
}
