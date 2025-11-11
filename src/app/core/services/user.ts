import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  collectionData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  constructor(private firestore: Firestore) {}

  register(user: { fullName: string; email: string; plotNumber?: string }) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, {
      ...user,
      status: 'pending',
      createdAt: Timestamp.now()
    });
  }

  getPending(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('status', '==', 'pending'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  approve(id: string) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, { status: 'approved' });
  }

  reject(id: string) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, { status: 'rejected' });
  }

  listMembers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('status', '==', 'approved'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
