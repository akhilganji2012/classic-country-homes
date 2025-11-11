import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // keep current user reference
    authState(this.auth).subscribe(user => (this.currentUser = user));
  }

  /** ✅ Returns observable of user Firestore document merged with auth state */
  currentUser$(): Observable<any> {
    return authState(this.auth).pipe(
      switchMap(async (user) => {
        if (!user) return null;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const snap = await getDoc(userRef);
        return snap.exists() ? { uid: user.uid, ...snap.data() } : null;
      })
    );
  }

  /** ✅ Sign in */
  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /** ✅ Sign out */
  async logout() {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  /** ✅ Returns true if logged in */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
