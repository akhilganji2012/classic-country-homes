import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-read-view-dialog',
  standalone: false,
  templateUrl: './read-view-dialog.html',
  styleUrl: './read-view-dialog.css'
})
export class ReadViewDialog {
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<ReadViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { images: any[], index: number }
  ) {
    this.currentIndex = data.index;
  }

  get currentImage() {
    return this.data.images[this.currentIndex].url;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.data.images.length;
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.data.images.length) % this.data.images.length;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
