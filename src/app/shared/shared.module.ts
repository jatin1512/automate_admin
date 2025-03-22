import { NgModule } from "@angular/core";
import { CommonModule, AsyncPipe } from "@angular/common";

import { SidebarComponent } from "./sidebar/sidebar.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InlineDeleteConfirmationComponent } from "./inline-delete-confirmation/inline-delete-confirmation.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterModule } from "@angular/router";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { DeleteConfirmationComponent } from "./delete-confirmation/delete-confirmation.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ValidationMessageComponent } from "./validation-message/validation-message.component";

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    InlineDeleteConfirmationComponent,
    LoadingSpinnerComponent,
    ValidationMessageComponent,
    SpinnerComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TooltipModule.forRoot()
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    InlineDeleteConfirmationComponent,
    LoadingSpinnerComponent,
    ValidationMessageComponent,
    SpinnerComponent,
    DeleteConfirmationComponent
  ],
  providers: [AsyncPipe],
})
export class SharedModule {}
