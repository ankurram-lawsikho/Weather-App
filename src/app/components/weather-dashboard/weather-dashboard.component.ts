import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { WeatherCardComponent } from '../weather-card/weather-card.component';
import { WeatherCardWrapperComponent } from '../weather-card-wrapper/weather-card-wrapper.component';
import { SearchComponent } from '../search/search.component';
import { WeatherData } from '../../models/weather.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WeatherCardComponent, WeatherCardWrapperComponent, SearchComponent],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('weatherContainer', { static: false }) weatherContainer!: ElementRef;
  
  currentWeather: WeatherData | null = null;
  forecast: WeatherData[] = [];
  loading = false;
  error: string | null = null;
  savedCities: string[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    console.log('🔄 WeatherDashboard ngOnInit');
    this.loadSavedCities();
    // Load weather for default city (London) on init
    this.getWeatherByCity('London');
  }

  ngAfterViewInit() {
    console.log('🔄 WeatherDashboard ngAfterViewInit - view is ready');
    
    // Access DOM elements
    if (this.weatherContainer) {
      console.log('Weather container element:', this.weatherContainer.nativeElement);
      this.initializeWeatherAnimations();
    }
  }

  ngOnDestroy() {
    console.log('🔄 WeatherDashboard ngOnDestroy - cleaning up subscriptions');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeWeatherAnimations() {
    console.log('Initializing weather animations...');
  }

  onCitySearch(city: string) {
    this.getWeatherByCity(city);
  }

  onCitySelect(city: string) {
    this.getWeatherByCity(city);
  }

  getWeatherByCity(city: string) {
    this.loading = true;
    this.error = null;

    // Now using the real weather service with OpenStreetMap and Open-Meteo APIs
    this.weatherService.getCurrentWeather(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.currentWeather = weather;
          this.loading = false;
          this.addToSavedCities(city);
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch weather data. Please try again.';
          this.loading = false;
          console.error('Weather fetch error:', err);
        }
      });

    // Also fetch forecast
    this.weatherService.getForecast(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (forecast) => {
          this.forecast = forecast;
        },
        error: (err) => {
          console.error('Forecast fetch error:', err);
        }
      });
  }

  private addToSavedCities(city: string) {
    if (!this.savedCities.includes(city)) {
      this.savedCities.unshift(city);
      if (this.savedCities.length > 5) {
        this.savedCities = this.savedCities.slice(0, 5);
      }
      this.saveCitiesToStorage();
    }
  }

  private loadSavedCities() {
    const saved = localStorage.getItem('savedCities');
    if (saved) {
      this.savedCities = JSON.parse(saved);
    }
  }

  private saveCitiesToStorage() {
    localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
  }
}
