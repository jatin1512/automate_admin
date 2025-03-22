import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-inline-delete-confirmation',
  templateUrl: './inline-delete-confirmation.component.html',
  styleUrls: ['./inline-delete-confirmation.component.scss']
})
export class InlineDeleteConfirmationComponent implements OnInit {

  @Output() delete = new EventEmitter();
  @Input() deleteBtnText = 'Delete';
  @Input() deleteConfirmMsg = 'Are you sure?';

  public confirmDelete = false;


  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.delete.emit();
  }
}
