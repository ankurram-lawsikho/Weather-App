import { Component, Input, OnChanges, SimpleChanges, DoCheck, KeyValueDiffers, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnChanges, DoCheck, AfterViewChecked {
  @Input() weather!: WeatherData;
  @Input() isCurrent: boolean = false;
  
  private differ: any;
  private lastWeatherData: any;
  private lastIsCurrent: boolean = false;

  constructor(private differs: KeyValueDiffers) {
    this.differ = this.differs.find({}).create();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔄 WeatherCard ngOnChanges triggered:', changes);
    
    if (changes['weather'] && !changes['weather'].firstChange) {
      console.log('Weather data changed from:', changes['weather'].previousValue);
      console.log('Weather data changed to:', changes['weather'].currentValue);
      this.onWeatherDataChange();
    }
    
    if (changes['isCurrent']) {
      console.log('isCurrent changed:', changes['isCurrent'].currentValue);
    }
  }

  ngDoCheck() {
    console.log('🔄 WeatherCard ngDoCheck - checking for changes');
    
    if (this.weather) {
      const changes = this.differ.diff(this.weather);
      
      if (changes) {
        console.log('Weather data object changed:', changes);
        changes.forEachChangedItem((item: any) => {
          console.log(`Property ${item.key} changed from ${item.previousValue} to ${item.currentValue}`);
        });
        this.handleWeatherDataChanges();
      }
    }
  }

  ngAfterViewChecked() {
    console.log('🔄 WeatherCard ngAfterViewChecked - view checked');
    
    // Check if isCurrent property changed
    if (this.isCurrent !== this.lastIsCurrent) {
      console.log('isCurrent property changed, updating view');
      this.lastIsCurrent = this.isCurrent;
    }
  }

  private onWeatherDataChange() {
    console.log('Weather data updated, refreshing display');
  }

  private handleWeatherDataChanges() {
    console.log('Handling weather data changes...');
  }

  getWeatherIcon(condition: string): string {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return '☀️';
    } else if (conditionLower.includes('cloud')) {
      return '☁️';
    } else if (conditionLower.includes('rain')) {
      return '🌧️';
    } else if (conditionLower.includes('snow')) {
      return '❄️';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return '⛈️';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return '🌫️';
    } else {
      return '🌤️';
    }
  }

  getTemperatureColor(temp: number): string {
    if (temp < 0) return '#3498db'; // Blue for cold
    if (temp < 10) return '#5dade2'; // Light blue
    if (temp < 20) return '#58d68d'; // Green
    if (temp < 30) return '#f7dc6f'; // Yellow
    return '#e74c3c'; // Red for hot
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
