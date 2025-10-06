import { Component, AfterContentInit, AfterContentChecked, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../weather-card/weather-card.component';

@Component({
  selector: 'app-weather-card-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-wrapper">
      <ng-content></ng-content>
      <div class="card-footer">
        <p>Last updated: {{ lastUpdated }}</p>
      </div>
    </div>
  `,
  styles: [`
    .card-wrapper {
      position: relative;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      margin: 10px 0;
    }
    
    .card-footer {
      background: #f5f5f5;
      padding: 8px 12px;
      border-top: 1px solid #e0e0e0;
      font-size: 0.8em;
      color: #666;
    }
  `]
})
export class WeatherCardWrapperComponent implements AfterContentInit, AfterContentChecked {
  @ContentChild(WeatherCardComponent) weatherCard!: WeatherCardComponent;
  
  lastUpdated: string = new Date().toLocaleTimeString();
  
  ngAfterContentInit() {
    console.log('🔄 WeatherCardWrapper ngAfterContentInit - content projected');
    
    if (this.weatherCard) {
      console.log('Weather card content initialized:', this.weatherCard);
      this.setupCardInteractions();
    }
  }
  
  ngAfterContentChecked() {
    // Update timestamp when content changes
    this.lastUpdated = new Date().toLocaleTimeString();
    console.log('🔄 WeatherCardWrapper ngAfterContentChecked - content checked');
  }
  
  private setupCardInteractions() {
    console.log('Setting up card interactions...');
  }
}
