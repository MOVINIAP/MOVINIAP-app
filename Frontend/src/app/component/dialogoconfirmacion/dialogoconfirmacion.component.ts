import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialogoconfirmacion.component.html',
})
export class DialogoconfirmacionComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoconfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
