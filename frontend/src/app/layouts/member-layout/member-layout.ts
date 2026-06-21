import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
// 👇 Ruta corregida sin el 'app/'
import { AuthService } from '../../auth/services/auth'; 

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  // 👇 Nombres cortos
  templateUrl: './member-layout.html',
  styleUrls: ['./member-layout.css']
})
export class MemberLayoutComponent implements OnInit {
  isUserMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/']); 
      }
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  doLogout(): void {
    this.authService.logout();
    window.location.href = '/'; 
  }
}