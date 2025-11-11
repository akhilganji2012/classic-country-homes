import { Component, inject, OnInit } from '@angular/core';
import { FileService } from '../../core/services/file-service';
import { AuthService } from '../../core/services/auth-service';
import { Storage, ref, listAll, getDownloadURL, uploadBytesResumable, UploadMetadata, uploadBytes } from '@angular/fire/storage';
import { finalize, Observable } from 'rxjs';
import { ReadViewDialog } from './read-view-dialog/read-view-dialog';
import { MatDialog } from '@angular/material/dialog';
import { addDoc, collection } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class Gallery implements OnInit {
  gallery: any[] = [];
  uploading = false;
  currentUserId: string  = '';
  downloadURL: string | null = null;
  dialog = inject(MatDialog);
  files: any[]=[];
  isAdmin:boolean = false
  approvedImages: any[]=[];
  loading=false;

  constructor(
    private fileService: FileService,
    private authService: AuthService,
    private storage: Storage,
    private toastr: ToastrService
  ) {
    // Get gallery data from Firestore
    // this.fileService.listApprovedImages().subscribe(items => (this.gallery = items as any[]));

    // Track the current user
    this.authService.currentUser$().subscribe(u => {this.currentUserId = u?.uid || null; this.isAdmin = u?.role === 'admin'});
  }


  ngOnInit() {
    this.loadImages();
  }

  async loadImages() {
    // const folderRef = ref(this.storage, 'images');
    // const listResult = await listAll(folderRef);
    this.loading = true;
    this.approvedImages = await this.fileService.listApprovedImages();
    this.loading = false;
    // const urls = await Promise.all(
    //   listResult.items.map(async item => await getDownloadURL(item))
    // );

    // this.imageUrls$ = new Observable(observer => {
    //   observer.next(urls);
    //   observer.complete();
    //   this.refreshFiles()
    // });
  }

  async deleteImage(img: any) {
    if (!confirm('Delete this image permanently?')) return;
    await this.fileService.deleteImage(img.id, img.storagePath);
    this.toastr.info('Image Deleted')
    await this.loadImages();
  }


allowDrop(e: DragEvent) {
  e.preventDefault();
}

onDrop(e: DragEvent) {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file) this.onFileChange({ target: { files: [file] } });
}


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.fileService.uploadFile(file, this.currentUserId)
      .then(() => {
        this.uploading = false;
        this.toastr.info('Admin Approval is required before the image can be uploaded.', 'Heads Up!');
        this.refreshFiles();
      })
      .catch(() => this.uploading = false);
  }
  refreshFiles() {
    this.fileService.listGallery().subscribe({
      next: (data) => this.files = data,
      error: (err) => console.error(err)
    });
  }

  openImage(index:any){
      const dialogRef = this.dialog.open(ReadViewDialog, {
        data: {images: this.approvedImages, index: index},

    })
  }

}
