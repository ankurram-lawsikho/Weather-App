import { Component, Input, OnChanges, SimpleChanges, DoCheck, KeyValueDiffers, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../models/weather.model';
import { WeatherIconPipe } from '../../pipes/weather-icon.pipe';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { WeatherDescriptionPipe } from '../../pipes/weather-description.pipe';
import { WeatherHighlightDirective } from '../../directives/weather-highlight.directive';
import { TemperatureColorDirective } from '../../directives/temperature-color.directive';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [
    CommonModule, 
    WeatherIconPipe, 
    TimeFormatPipe, 
    WeatherDescriptionPipe,
    WeatherHighlightDirective,
    TemperatureColorDirective
  ],
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
