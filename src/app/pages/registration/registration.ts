import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class Registration {
  loading = false;
  errorMessage = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snack: MatSnackBar
  ) {
     this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      plotNumber: ['']
    });
  }


  async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { firstName, lastName, email, password, plotNumber } = this.form.value;
    this.loading = true;

    try {
      // 1️⃣ Initialize Firebase Auth & Firestore
      const auth = getAuth();
      const firestore = getFirestore();

      // 2️⃣ Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email!, password!);

      // 3️⃣ Add user details in Firestore
      const uid = cred.user?.uid;
      if (uid) {
        const userDoc = {
          uid,
          firstName,
          lastName,
          email,
          plot: plotNumber || null,
          role: 'member',
          status: 'pending',
          createdAt: new Date()
        };

        await setDoc(doc(firestore, `users/${uid}`), userDoc);
      }

      // 4️⃣ Optionally send email verification
      await sendEmailVerification(cred.user!);

      // 5️⃣ Navigate to login
      this.snack.open('Registration successful! Please log in.', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);

    } catch (error: any) {
      this.errorMessage = error.message;
      this.snack.open(`Error: ${error.message}`, 'Close', { duration: 4000 });
    } finally {
      this.loading = false;
    }
  }
}
