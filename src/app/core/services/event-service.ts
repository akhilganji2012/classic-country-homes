import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: Firestore) {}

  addEvent(event: { title: string; description: string; date: string }) {
    const eventsRef = collection(this.firestore, 'events');
    return addDoc(eventsRef, { ...event, createdAt: Timestamp.now() });
  }

  listEvents(): Observable<any[]> {
    const eventsRef = collection(this.firestore, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
