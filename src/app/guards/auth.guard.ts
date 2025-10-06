import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is authenticated (example logic)
    // In a real app, you would check a token or user session
    const isAuthenticated = localStorage.getItem('userToken') !== null;
    
    if (!isAuthenticated) {
      // Redirect to a login page or show a message
      console.log('User not authenticated, redirecting...');
      // For demo purposes, we'll just allow access
      // In a real app: this.router.navigate(['/login']);
      return true; // Allow access for demo
    }
    
    return true;
  }
}
