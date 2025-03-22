import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { FormService } from '../../../shared/validation-message/form.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.scss']
})
export class AddEditCarComponent implements OnInit {

  public form!: FormGroup;
  public years: any;
  public carCompanys: any;
  public companyModelName: any;
  public carCompanySubModels: any;
  public carId: any;
  public isLoading: any;
  public companyName: any;
  carImage: any = '';
  car3dModel: any = '';
  carManualyFile: any = '';
  public carYearId: any = 0;
  public carCompanyId: any;
  
  constructor(
    private httpRequest: HttpRequestsService,
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private translation: TranslationService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.carId = this.route.snapshot.params['id'];
    this.form = new FormGroup({
      modelYearId: new FormControl(null, Validators.required),
      carCompanyId: new FormControl(null, Validators.required),
      modelId: new FormControl(null, Validators.required),
      subModelId: new FormControl(null),
      transmission: new FormControl(null),
      fuelType: new FormControl(null),
      engine: new FormControl(null),
      horsePower: new FormControl(null),
      torque: new FormControl(null),
      carImage: new FormControl(null),
      car3dModel: new FormControl(null),
      carManualyFile: new FormControl(null),
    });
    // this.getCarCompanyName();
    await this.getCarCompanyModel();
    await this.getCarDetails();
  }

  async getCarCompanyName() {
    const carCompanyName = await this.httpRequest.get(`/car/car-company`) as any;
    this.companyName = carCompanyName.data;
  }

  async getYearComany(category: any) {
    const subCategories = await this.httpRequest.get(`/car/car-model/${category.id}`) as any;
    const subDetails = await this.httpRequest.get(`/car/car-sub-model-with-modelId/${category.id}`) as any;
    this.years = [subCategories.data.modelyear];
    this.companyName = [subCategories.data.carcompany];
    this.carCompanySubModels = subDetails.data;
    this.form.patchValue({
      modelYearId: subCategories.data.modelYearId,
      carCompanyId: subCategories.data.carCompanyId,
    });
  }

  async getCarCompanyModel() {
    const carCompanyName = await this.httpRequest.get(`/car/all-car-model`) as any;
    this.companyModelName = carCompanyName.data;
  }

  async getCarCompanySubModel() {
    const companySubModels = await this.httpRequest.get(`/car/all-car-sub-model`) as any;
    this.carCompanySubModels = companySubModels.data;
    
  }

  async selectCarYearId(modelYearId: any) {
    this.carYearId = modelYearId.id;
  }

  async getYear() {
    const res = await this.httpRequest.get('/car/model-year', {}) as any;
    this.years = res.data;
  }

  async getCarDetails() {
    this.form.disable();
    if (this.carId) {
      const carYear = await this.httpRequest.get(`/car/admin-car-details/${this.carId}`) as any;
      const subCategories = await this.httpRequest.get(`/car/car-model/${carYear.data.modelId}`) as any;
      const subDetails = await this.httpRequest.get(`/car/car-sub-model-with-modelId/${carYear.data.modelId}`) as any;
      this.years = [subCategories.data.modelyear];
      this.companyName = [subCategories.data.carcompany];
      this.carCompanySubModels = subDetails.data;
      this.form.patchValue({
        modelYearId: carYear.data.modelYearId,
        carCompanyId: carYear.data.carCompanyId,
        modelId: carYear.data.modelId,
        subModelId: carYear.data.subModelId,
        transmission: carYear.data.transmission,
        fuelType: carYear.data.fuelType,
        engine: carYear.data.engine,
        horsePower: carYear.data.horsePower,
        torque: carYear.data.torque,
        carImage: carYear.data.carImage,
        car3dModel: carYear.data.car3dModel,
        carManualyFile: carYear.data.carManualyFile,
      });
    }
    this.form.enable();
  }

  
  async carImageUpload(choosenFile: any) {
    const result: any = await this.chooseImageEvent(choosenFile);
    this.form.patchValue({
      carImage: result
    })
  }

  async car3dModelUpload(choosenFile: any) {
    const result: any = await this.chooseImageEvent(choosenFile);
    this.form.patchValue({
      car3dModel: result
    })
  }

  async carManualyFileUpload(choosenFile: any) {
    const result: any = await this.chooseImageEvent(choosenFile);
    this.form.patchValue({
      carManualyFile: result
    })
  }

  async chooseImageEvent(choosenFile: { target: { files: any[]; }; }) {
    const file = choosenFile.target.files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);
    const result: any = await this.httpRequest.post(`/user/profile-image`, uploadData );
    this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_IMAGE_UPDATED'));
    return result.data.name;
  }

  get formControls() {
    return this.form.controls;
  }

  async addPincode() {
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.carId) {
        await this.httpRequest.post(`/car/edit-admin-car`, { ...this.form.value, id: this.carId });
        this.toastr.success(this.translation.getLocalizedString('SUCCESFULLY_CAR_UPDATED'));
      } else {
        await this.httpRequest.post('/car/add-admin-car', { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESFULLY_CAR_ADDED'));
      }
      this.router.navigate(['/car']);
    }
  }

  public cancel() {
    this.router.navigate(['/car']);
  }
}
