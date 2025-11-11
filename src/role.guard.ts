import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data['role'];

    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
          return;
        }

        try {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          if (userData && userData['role'] === expectedRole) {
            observer.next(true);
          } else {
            this.router.navigate(['/unauthorized']);
            observer.next(false);
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          this.router.navigate(['/unauthorized']);
          observer.next(false);
        }

        observer.complete();
      });
    });
  }
}
