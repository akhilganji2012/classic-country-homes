import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private firestore = getFirestore();
  private storage = getStorage();

  async uploadFile(file: File, uploadedBy: string): Promise<void> {
    // Create a new document reference (auto ID)
    const imagesCollection = collection(this.firestore, 'images');
    const newDocRef = doc(imagesCollection);
    const docId = newDocRef.id;

    // Use a safe filename
    const safeName = file.name.replace(/[^\w.-]/g, '_');
    const fileRef = ref(this.storage, `images/${docId}_${safeName}`);

    // Metadata for Firebase Storage
    const metadata = {
      contentType: file.type,
      customMetadata: { uploadedBy }
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    return new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          const meta = {
            id: docId,
            name: file.name,
            type: file.type,
            url,
            size: file.size,
            uploadedBy,
            approved: false,
            createdAt: serverTimestamp(),
            storagePath: `images/${docId}_${safeName}`,
          };

          console.log('Uploading metadata for', file.name, meta);
          await setDoc(newDocRef, meta);
          console.log('Firestore document added with ID', docId);

          resolve();
        }
      );
    });
  }

  listGallery(): Observable<any[]> {
    const galleryRef = collection(this.firestore, 'images');
    const q = query(galleryRef, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }

  async listApprovedImages(): Promise<any[]> {
    const galleryRef = collection(this.firestore, 'images');
    const q = query(galleryRef, where('approved', '==', true), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  }

  async listPendingImages(): Promise<any[]> {
    const galleryRef = collection(this.firestore, 'images');
    const q = query(galleryRef, where('approved', '==', false), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async approveImage(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'images', id);
    await updateDoc(docRef, { approved: true });
  }

  async deleteImage(id: string, storagePath: string): Promise<void> {
    const fileRef = ref(this.storage, storagePath);
    await deleteObject(fileRef).then(() => {
      console.log('File deleted successfully');
    })
    .catch((error) => {
      // Handle errors here, such as 'storage/object-not-found'
      console.error('Error deleting file:', error);
      throw error; // Re-throw the error for the calling component/function to handle
    });
    const docRef = doc(this.firestore, 'images', id);
    await deleteDoc(docRef);
  }
}
