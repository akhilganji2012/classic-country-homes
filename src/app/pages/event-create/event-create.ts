import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event-service';

@Component({
  selector: 'app-event-create',
  standalone: false,
  templateUrl: './event-create.html',
  styleUrl: './event-create.css'
})
export class EventCreate {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private es: EventService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;

    try {
      await this.es.addEvent(this.form.value);
      this.snack.open('✅ Event created successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/']);
    } catch (err: any) {
      console.error(err);
      this.snack.open('❌ Create failed: ' + (err?.message || err), 'Close', { duration: 4000 });
    } finally {
      this.loading = false;
    }
  }
}
