import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../core/services/user';
import { FileService } from '../../core/services/file-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit{
  pending: any[] = [];
  pendingImages: any[] = [];
  loading = false;

  constructor(private userService: User, private snack: MatSnackBar,private fileService: FileService) {}

  ngOnInit() {
    this.userService.getPending().subscribe(list => this.pending = list as any[]);
    this.loadPendingImages();
  }

  async loadPendingImages() {
    this.loading = true;
    this.pendingImages = await this.fileService.listPendingImages();
    this.loading = false;
  }

  async approveImage(img: any) {
    await this.fileService.approveImage(img.id);
    this.snack.open('Image approved', 'Close', { duration: 2000 });
    await this.loadPendingImages();
  }

  async deleteImage(img: any) {
    if (!confirm('Delete this image permanently?')) return;
    await this.fileService.deleteImage(img.id, img.storagePath);
    this.snack.open('Image deleted', 'Close', { duration: 2000 });
    await this.loadPendingImages();
  }

  approve(id: string) {
    this.userService.approve(id).then(() => this.snack.open('Approved', 'Close', { duration: 2000 }));
  }

  reject(id: string) {
    this.userService.reject(id).then(() => this.snack.open('Rejected', 'Close', { duration: 2000 }));
  }
}
