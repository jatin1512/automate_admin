import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  public message = 'Are you sure you want to delete?';

  public onClose: Subject<boolean> = new Subject();

  constructor(
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  public discardClicked() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  public confirmClicked() {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}
