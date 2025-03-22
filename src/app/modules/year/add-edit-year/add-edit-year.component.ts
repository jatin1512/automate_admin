import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from '../../../services/http-requests.service';
import { FormService } from '../../../shared/validation-message/form.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-add-edit-year',
  templateUrl: './add-edit-year.component.html',
  styleUrls: ['./add-edit-year.component.scss']
})
export class AddEditYearComponent implements OnInit {

  public form!: FormGroup;
  public yearId: any;
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
    this.yearId = this.route.snapshot.params['id'];
    this.form = new FormGroup({
      year: new FormControl(null, Validators.required)
    });
    this.getYear();
  }

  async getYear() {
    this.form.disable();
    if (this.yearId) {
      const year = await this.httpRequest.get(`/car/model-year/${this.yearId}`) as any;
      this.form.patchValue({
        year: year.data.year
      });
    }
    this.form.enable();
  }

  get formControls() {
    return this.form.controls;
  }

  async addPincode() {
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.yearId) {
        await this.httpRequest.post(`/car/edit-model-year/${this.yearId}`, { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_YEAR_UPDATED'));
      } else {
        await this.httpRequest.post('/car/add-model-year', { ...this.form.value });
        this.toastr.success(this.translation.getLocalizedString('SUCCESSFULLY_YEAR_ADDED'));
      }
      this.router.navigate(['/year']);
    }
  }

  public cancel() {
    this.router.navigate(['/year']);
  }
}
