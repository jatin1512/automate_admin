import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { FormService } from '../../../shared/validation-message/form.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-add-edit-car-company-sub-model',
  templateUrl: './add-edit-car-company-sub-model.component.html',
  styleUrls: ['./add-edit-car-company-sub-model.component.scss']
})
export class AddEditCarCompanySubModelComponent implements OnInit {

  public form!: FormGroup;
  public carCompanySubModelId: any;
  public years: any;
  public companyName: any;
  public companyModelName: any;
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
    this.carCompanySubModelId = this.route.snapshot.params['id'];
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      modelYearId: new FormControl(null, Validators.required),
      carCompanyId: new FormControl(null, Validators.required),
      modelId: new FormControl(null, Validators.required),
      transmission: new FormControl(null),
      fuelType: new FormControl(null),
      engine: new FormControl(null),
      horsePower: new FormControl(null),
      torque: new FormControl(null)
    });
    this.getCarCompanyName();
    this.getCarCompanyModel();
    this.getCarCompanySubModel();
  }

  async getCarCompanyName() {
    const carCompanyName = await this.httpRequest.get(`/car/car-company`) as any;
    this.companyName = carCompanyName.data;
  }

  async getCarCompanyModel() {
    const carCompanyName = await this.httpRequest.get(`/car/all-car-model`) as any;
    this.companyModelName = carCompanyName.data;
  }

  async getYearComany(category: any) {
    const subCategories = await this.httpRequest.get(`/car/car-model/${category.id}`) as any;
    this.years = [subCategories.data.modelyear];
    this.companyName = [subCategories.data.carcompany];
    this.form.patchValue({
      modelYearId: subCategories.data.modelYearId,
      carCompanyId: subCategories.data.carCompanyId,
    });
  }

  async getCarCompanySubModel() {
    this.form.disable();
    if (this.carCompanySubModelId) {
      const carCompaanyDetails = await this.httpRequest.get(`/car/car-sub-model/${this.carCompanySubModelId}`) as any;
      this.years = [carCompaanyDetails.data.modelyear];
      this.companyName = [carCompaanyDetails.data.carcompany];
      this.form.patchValue({
        name: carCompaanyDetails.data.name,
        modelYearId: carCompaanyDetails.data.modelYearId,
        carCompanyId: carCompaanyDetails.data.carCompanyId,
        modelId: carCompaanyDetails.data.modelId,
        transmission: carCompaanyDetails.data.transmission,
        fuelType: carCompaanyDetails.data.fuelType,
        engine: carCompaanyDetails.data.engine,
        horsePower: carCompaanyDetails.data.horsePower,
        torque: carCompaanyDetails.data.torque
      });
    }
    this.form.enable();
  }

  get formControls() {
    return this.form.controls;
  }

  async addCarSubModel() {
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.carCompanySubModelId) {
        await this.httpRequest.post(`/car/edit-car-sub-model/${this.carCompanySubModelId}`, { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_CARCOMPANYSUBMODEL_UPDATED'));
      } else {
        const result: any = await this.httpRequest.post('/car/add-car-sub-model', { ...this.form.value });
        const carAddObject = {
          modelYearId: this.form.value.modelYearId,
          carCompanyId: this.form.value.carCompanyId,
          subModelId: result.data.id, 
          modelId: this.form.value.modelId,
          transmission: this.form.value.transmission,
          fuelType: this.form.value.fuelType,
          engine: this.form.value.engine,
          horsePower: this.form.value.horsePower,
          torque: this.form.value.torque
        }
        await this.httpRequest.post('/car/add-admin-car', carAddObject);
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_CARCOMPANYSUBMODEL_ADDED'));
      }
      this.router.navigate(['/car-company-sub-model']);
    }
  }

  public cancel() {
    this.router.navigate(['/car-company-sub-model']);
  }
}
