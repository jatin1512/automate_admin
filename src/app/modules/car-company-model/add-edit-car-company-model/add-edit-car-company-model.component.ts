import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { TranslationService } from '../../../services/translation.service';
import { FormService } from '../../../shared/validation-message/form.service';

@Component({
  selector: 'app-add-edit-car-company-model',
  templateUrl: './add-edit-car-company-model.component.html',
  styleUrls: ['./add-edit-car-company-model.component.scss']
})
export class AddEditCarCompanyModelComponent implements OnInit {

  public form!: FormGroup;
  public years: any;
  public companyName: any;
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
      name: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      cname: new FormControl(null, Validators.required)
    });
    this.getYear();
    this.getCarCompanyName();
    this.getCarCompanyModel();
  }

  async getYear() {
    const carYears = await this.httpRequest.get(`/car/model-year`) as any;
    this.years = carYears.data;
  }

  async getCarCompanyName() {
    const carCompanyName = await this.httpRequest.get(`/car/car-company`) as any;
    this.companyName = carCompanyName.data;
  }

  async getCarCompanyModel() {
    this.form.disable();
    if (this.carCompanyId) {
      const carCompaanyDetails = await this.httpRequest.get(`/car/car-model/${this.carCompanyId}`) as any;
      this.form.patchValue({
        name: carCompaanyDetails.data.name,
        year: carCompaanyDetails.data.modelYearId,
        cname: carCompaanyDetails.data.carCompanyId
      });
    }
    this.form.enable();
  }

  get formControls() {
    return this.form.controls;
  }

  async addCarModel() {
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      const carObject = {
        "name": this.form.value.name,
        "modelYearId": this.form.value.year,
        "carCompanyId": this.form.value.cname
      }
      if (this.carCompanyId) {
        await this.httpRequest.post(`/car/edit-car-model/${this.carCompanyId}`, carObject);
        this.toastr.success(this.translation.getLocalizedString('SUCCESFULLY_CARCOMPANYMODEL_UPDATED'));
      } else {
        await this.httpRequest.post('/car/add-car-model', carObject);
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_CARCOMPANYMODEL_ADDED'));
      }
      this.router.navigate(['/car-company-model']);
    }
  }

  public cancel() {
    this.router.navigate(['/car-company-model']);
  }
}
