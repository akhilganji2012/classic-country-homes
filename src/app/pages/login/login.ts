import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      const user = await this.authService.login(this.form.value.email, this.form.value.password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.snack.open('Login failed: ' + (err?.message || err), 'Close', { duration: 4000 });
    } finally {
      this.loading = false;
    }
  }
}
