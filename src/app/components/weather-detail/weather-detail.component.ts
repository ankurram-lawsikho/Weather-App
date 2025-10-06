import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { WeatherData } from '../../models/weather.model';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="weather-detail">
      <div class="back-button">
        <button (click)="goBack()" class="btn-back">← Back to Dashboard</button>
      </div>
      
      <div class="city-header">
        <h1>{{ cityName | titlecase }}</h1>
        <p>Detailed Weather Information</p>
        
        <div class="temperature-unit-selector">
          <label for="tempUnit">Temperature Unit:</label>
          <select id="tempUnit" [(ngModel)]="selectedUnit" (change)="onUnitChange()" class="unit-select">
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>
        </div>
      </div>
      
      <div *ngIf="weather" class="weather-content">
        <div class="main-weather-card" appWeatherHighlight [highlightColor]="'lightblue'">
          <div class="card-header">
            <div class="location-info">
              <h3 class="city-name">{{ weather.city | uppercase }}</h3>
              <p class="country">{{ weather.country | titlecase }}</p>
            </div>
            <div class="date-time">
              <p class="date">{{ weather.date | date:'EEEE, MMM d' }}</p>
              <p class="time">{{ weather.date | timeFormat:'short' }}</p>
            </div>
          </div>

          <div class="weather-main">
            <div class="temperature-section">
              <div class="temperature" appTemperatureColor [appTemperatureColor]="getConvertedTemperature(weather.temperature)">
                {{ getConvertedTemperature(weather.temperature) }}°{{ getUnitSymbol() }}
              </div>
              <div class="feels-like">
                Feels like {{ getConvertedTemperature(weather.feelsLike) }}°{{ getUnitSymbol() }}
              </div>
            </div>
            
            <div class="weather-icon">
              {{ weather.condition | weatherIcon }}
            </div>
          </div>

          <div class="weather-details">
            <div class="condition">
              <span class="condition-text">{{ weather.condition | titlecase }}</span>
              <p class="weather-tip">{{ weather.condition | weatherDescription }}</p>
            </div>
          </div>
        </div>
        
        <div class="additional-info">
          <h3>Detailed Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Humidity:</span>
              <span class="value">{{ weather.humidity | number:'1.0-0' }}%</span>
            </div>
            <div class="info-item">
              <span class="label">Wind Speed:</span>
              <span class="value">{{ weather.windSpeed | number:'1.0-0' }} km/h</span>
            </div>
            <div class="info-item">
              <span class="label">Wind Direction:</span>
              <span class="value">{{ weather.windDirection }}°</span>
            </div>
            <div class="info-item">
              <span class="label">Pressure:</span>
              <span class="value">{{ weather.pressure | number:'1.0-0' }} hPa</span>
            </div>
            <div class="info-item">
              <span class="label">Visibility:</span>
              <span class="value">{{ weather.visibility | number:'1.0-0' }} km</span>
            </div>
            <div class="info-item">
              <span class="label">UV Index:</span>
              <span class="value">{{ weather.uvIndex || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading weather data for {{ cityName }}...</p>
      </div>
      
      <div *ngIf="error" class="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button (click)="loadWeather()" class="retry-btn">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .weather-detail {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .back-button {
      margin-bottom: 2rem;
    }
    
    .btn-back {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .btn-back:hover {
      background: linear-gradient(135deg, #2980b9, #1f618d);
      transform: translateY(-2px);
    }
    
    .city-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .city-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    .city-header p {
      font-size: 1.1rem;
      color: #7f8c8d;
      margin: 0 0 1rem 0;
    }
    
    .temperature-unit-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }
    
    .temperature-unit-selector label {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .unit-select {
      padding: 0.5rem;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      background: white;
      font-size: 0.9rem;
      cursor: pointer;
    }
    
    .unit-select:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .main-weather-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 2rem;
      color: white;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .additional-info {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .additional-info h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }
    
    .info-item .label {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .info-item .value {
      font-weight: 500;
      color: #34495e;
    }
    
    .loading, .error {
      text-align: center;
      padding: 3rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .retry-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    @media (max-width: 768px) {
      .weather-detail {
        padding: 1rem;
      }
      
      .city-header h1 {
        font-size: 2rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WeatherDetailComponent implements OnInit {
  cityName: string = '';
  weather: WeatherData | null = null;
  loading: boolean = false;
  error: string = '';
  selectedUnit: 'celsius' | 'fahrenheit' = 'celsius';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    // Get route parameter
    this.route.params.subscribe(params => {
      this.cityName = params['city'];
      if (this.cityName) {
        this.loadWeather();
      }
    });
  }

  loadWeather() {
    this.loading = true;
    this.error = '';
    
    this.weatherService.getCurrentWeather(this.cityName).subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load weather data for ' + this.cityName;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getUnitSymbol(): string {
    return this.selectedUnit === 'celsius' ? 'C' : 'F';
  }

  getConvertedTemperature(celsius: number): number {
    if (this.selectedUnit === 'fahrenheit') {
      // Convert Celsius to Fahrenheit: F = (C * 9/5) + 32
      return Math.round((celsius * 9/5) + 32);
    }
    // Return Celsius as is
    return Math.round(celsius);
  }

  onUnitChange() {
    // Unit change is handled automatically by the template
    // The temperature conversion method will recalculate the values
  }
}
