import { Component, OnInit } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-docs',
  standalone: false,
  templateUrl: './docs.html',
  styleUrl: './docs.css'
})
export class Docs implements OnInit{
  pdfs: any[] = [];
  uploading = false;
  currentUserId = 'admin'; // replace with your auth user
  selectedPdfUrl: string | null = null;
  user: any = null;

  private firestore = getFirestore();
  private storage = getStorage();

  async ngOnInit() {
    await this.refreshFiles();
  }

  constructor(private authService: AuthService){
    this.authService.currentUser$().subscribe(u => this.user = u);

  }

  async refreshFiles() {
    this.pdfs = await this.listPdfs();
  }


allowDrop(e: DragEvent) {
  e.preventDefault();
}

onDrop(e: DragEvent) {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file) this.onFileChange({ target: { files: [file] } });
}

openViewer(pdf: any) {
  this.selectedPdfUrl = pdf.url + "#toolbar=0&navpanes=0&scrollbar=0";
  document.body.style.overflow = 'hidden';
}

closeViewer() {
  this.selectedPdfUrl = null;
  document.body.style.overflow = 'auto';
}

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    try {
      await this.uploadPdf(file, this.currentUserId);
      await this.refreshFiles();
    } catch (err) {
      console.error(err);
    } finally {
      this.uploading = false;
    }
  }


  // 📤 Upload a PDF file
  async uploadPdf(file: File, uploadedBy: string): Promise<void> {
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Please upload a valid PDF file.');
    }

    const fileRef = ref(this.storage, `pdfs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const meta = {
            name: file.name,
            type: file.type,
            url,
            size: file.size,
            uploadedBy,
            createdAt: new Date().toISOString(),
          };
          await addDoc(collection(this.firestore, 'pdfs'), meta);
          resolve();
        }
      );
    });
  }

  // 📋 List all uploaded PDFs
  async listPdfs() {
    const pdfsRef = collection(this.firestore, 'pdfs');
    const q = query(pdfsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  async deletePdf(event: Event, pdf: any) {
    event.stopPropagation(); // Prevent opening viewer

    if (!confirm(`Delete "${pdf.name}"?`)) return;

    try {
      // Extract file path from URL (Firebase stores full link)
      const filePath = decodeURIComponent(pdf.url.split('/o/')[1].split('?')[0]);
      const storageRef = ref(this.storage, filePath);

      // Delete from Firebase Storage
      await deleteObject(storageRef);

      // Delete Firestore metadata
      await deleteDoc(doc(this.firestore, 'pdfs', pdf.id));

      // Refresh list
      await this.refreshFiles();

      console.log(`Deleted file: ${pdf.name}`);
    } catch (err) {
      console.error("Error deleting file", err);
      alert("Failed to delete file. Check console for details.");
    }
  }
}

