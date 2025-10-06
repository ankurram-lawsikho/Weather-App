import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { WeatherData } from '../../models/weather.model';
import { SharedModule } from '../../shared/shared.module';
import { TemperatureConverterPipe } from '../../pipes/temperature-converter.pipe';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, TemperatureConverterPipe],
  template: `
    <div class="forecast-container">
      <div class="forecast-header">
        <h1>5-Day Weather Forecast</h1>
        
        <div class="forecast-controls">
          <div class="control-group">
            <label for="cityInput">City:</label>
            <input 
              id="cityInput"
              type="text" 
              [(ngModel)]="selectedCity" 
              placeholder="Enter city name"
              (keyup.enter)="updateForecast()"
              class="city-input">
          </div>
          
          <div class="control-group">
            <label for="unitsSelect">Units:</label>
            <select 
              id="unitsSelect"
              [(ngModel)]="selectedUnits" 
              (change)="updateForecast()"
              class="units-select">
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>
          
          <button (click)="updateForecast()" class="update-btn">
            Update Forecast
          </button>
        </div>
      </div>
      
      <div *ngIf="forecast.length > 0" class="forecast-grid">
        <div *ngFor="let day of forecast; let i = index" class="forecast-card" appWeatherHighlight [highlightColor]="'lightblue'">
          <div class="card-header">
            <h3>{{ getDayName(i) }}</h3>
            <p class="date">{{ day.date | date:'MMM d' }}</p>
          </div>
          
          <div class="weather-icon">
            {{ day.condition | weatherIcon }}
          </div>
          
          <div class="temperature">
            <div class="max-temp" appTemperatureColor [appTemperatureColor]="day.maxTemp | temperatureConverter:selectedUnits">
              {{ day.maxTemp | temperatureConverter:selectedUnits }}°{{ unitSymbol }}
            </div>
            <div class="min-temp" appTemperatureColor [appTemperatureColor]="day.minTemp | temperatureConverter:selectedUnits">
              {{ day.minTemp | temperatureConverter:selectedUnits }}°{{ unitSymbol }}
            </div>
          </div>
          
          <div class="condition">
            <p>{{ day.condition | titlecase }}</p>
            <p class="weather-tip">{{ day.condition | weatherDescription }}</p>
          </div>
          
          <div class="forecast-details">
            <div class="detail-item">
              <span class="label">Humidity:</span>
              <span class="value">{{ day.humidity | number:'1.0-0' }}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Wind:</span>
              <span class="value">{{ day.windSpeed | number:'1.0-0' }} km/h</span>
            </div>
            <div class="detail-item">
              <span class="label">Pressure:</span>
              <span class="value">{{ day.pressure | number:'1.0-0' }} hPa</span>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading forecast for {{ selectedCity }}...</p>
      </div>
      
      <div *ngIf="error" class="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button (click)="loadForecast()" class="retry-btn">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .forecast-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .forecast-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .forecast-header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin: 0 0 2rem 0;
    }
    
    .forecast-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: end;
      flex-wrap: wrap;
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .control-group label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }
    
    .city-input, .units-select {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
    }
    
    .city-input:focus, .units-select:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .update-btn {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .update-btn:hover {
      background: linear-gradient(135deg, #2980b9, #1f618d);
      transform: translateY(-2px);
    }
    
    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .forecast-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .forecast-card:hover {
      transform: translateY(-5px);
    }
    
    .card-header {
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .card-header h3 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.25rem;
    }
    
    .card-header .date {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .weather-icon {
      text-align: center;
      font-size: 3rem;
      margin: 1rem 0;
    }
    
    .temperature {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .max-temp, .min-temp {
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .max-temp {
      color: #e74c3c;
    }
    
    .min-temp {
      color: #3498db;
    }
    
    .condition {
      text-align: center;
      margin: 1rem 0;
    }
    
    .condition p {
      margin: 0.25rem 0;
      color: #2c3e50;
    }
    
    .weather-tip {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-style: italic;
    }
    
    .forecast-details {
      margin-top: 1rem;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .detail-item:last-child {
      border-bottom: none;
    }
    
    .detail-item .label {
      font-weight: 500;
      color: #7f8c8d;
    }
    
    .detail-item .value {
      font-weight: 600;
      color: #2c3e50;
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
      .forecast-container {
        padding: 1rem;
      }
      
      .forecast-header h1 {
        font-size: 2rem;
      }
      
      .forecast-controls {
        flex-direction: column;
        align-items: center;
      }
      
      .city-input, .units-select {
        min-width: 250px;
      }
      
      .forecast-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class ForecastComponent implements OnInit {
  selectedCity: string = 'London';
  selectedUnits: 'metric' | 'imperial' = 'metric';
  forecast: WeatherData[] = [];
  unitSymbol: string = 'C';
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCity = params['city'] || 'London';
      this.selectedUnits = (params['units'] === 'imperial') ? 'imperial' : 'metric';
      this.unitSymbol = this.selectedUnits === 'metric' ? 'C' : 'F';
      this.loadForecast();
    });
  }

  updateForecast() {
    // Update URL with query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        city: this.selectedCity,
        units: this.selectedUnits
      }
    });
  }

  loadForecast() {
    this.loading = true;
    this.error = '';
    
    this.weatherService.getForecast(this.selectedCity).subscribe({
      next: (data) => {
        this.forecast = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load forecast for ' + this.selectedCity;
        this.loading = false;
      }
    });
  }

  getDayName(index: number): string {
    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
    return days[index] || `Day ${index + 1}`;
  }
}
