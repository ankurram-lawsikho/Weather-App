import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import components
import { WeatherDashboardComponent } from '../components/weather-dashboard/weather-dashboard.component';
import { WeatherCardComponent } from '../components/weather-card/weather-card.component';
import { WeatherCardWrapperComponent } from '../components/weather-card-wrapper/weather-card-wrapper.component';
import { SearchComponent } from '../components/search/search.component';

// Import shared module
import { SharedModule } from '../shared/shared.module';

// Import services
import { WeatherService } from '../services/weather.service';

const routes: Routes = [
  { path: '', component: WeatherDashboardComponent },
  { path: 'detail/:city', loadComponent: () => import('../components/weather-detail/weather-detail.component').then(m => m.WeatherDetailComponent) }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    // Import standalone components
    WeatherDashboardComponent,
    WeatherCardComponent,
    WeatherCardWrapperComponent,
    SearchComponent
  ],
  exports: [
    WeatherDashboardComponent,
    WeatherCardComponent
  ],
  providers: [
    WeatherService
  ]
})
export class WeatherModule { }
