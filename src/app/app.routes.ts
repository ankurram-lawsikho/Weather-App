import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirect to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Dashboard route
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/weather-dashboard/weather-dashboard.component')
      .then(m => m.WeatherDashboardComponent),
    canActivate: [AuthGuard]
  },
  
  // Weather detail with route parameter
  { 
    path: 'weather/:city', 
    loadComponent: () => import('./components/weather-detail/weather-detail.component')
      .then(m => m.WeatherDetailComponent),
    canActivate: [AuthGuard]
  },
  
  // Forecast route with query parameters support
  { 
    path: 'forecast', 
    loadComponent: () => import('./components/forecast/forecast.component')
      .then(m => m.ForecastComponent),
    canActivate: [AuthGuard]
  },
  
  // Settings route
  { 
    path: 'settings', 
    loadComponent: () => import('./components/settings/settings.component')
      .then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  
  // Lazy-loaded weather module (alternative approach)
  {
    path: 'weather-module',
    loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule)
  },
  
  // Wildcard route - 404 page
  { path: '**', redirectTo: '/dashboard' }
];
