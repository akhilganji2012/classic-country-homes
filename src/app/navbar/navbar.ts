import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {
 user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$().subscribe(u => this.user = u);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/']));
  }
}
