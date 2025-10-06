import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>🌤️ Weather App</h2>
      </div>
      
      <div class="nav-links">
        <a routerLink="/dashboard" 
           routerLinkActive="active" 
           [routerLinkActiveOptions]="{exact: true}">
          Dashboard
        </a>
        
        <a routerLink="/forecast" 
           routerLinkActive="active">
          Forecast
        </a>
        
        <a routerLink="/settings" 
           routerLinkActive="active">
          Settings
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .nav-brand h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: background-color 0.3s;
      font-weight: 500;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
    }
    
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class NavigationComponent {
  constructor(private router: Router) {}
}
