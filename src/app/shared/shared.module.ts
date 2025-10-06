import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import pipes
import { WeatherIconPipe } from '../pipes/weather-icon.pipe';
import { TemperatureColorPipe } from '../pipes/temperature-color.pipe';
import { TimeFormatPipe } from '../pipes/time-format.pipe';
import { WeatherDescriptionPipe } from '../pipes/weather-description.pipe';

// Import directives
import { WeatherHighlightDirective } from '../directives/weather-highlight.directive';
import { CityValidatorDirective } from '../directives/city-validator.directive';
import { TemperatureColorDirective } from '../directives/temperature-color.directive';

@NgModule({
  imports: [
    CommonModule,
    // Import standalone pipes and directives
    WeatherIconPipe,
    TemperatureColorPipe,
    TimeFormatPipe,
    WeatherDescriptionPipe,
    WeatherHighlightDirective,
    CityValidatorDirective,
    TemperatureColorDirective
  ],
  exports: [
    CommonModule,
    // Export pipes
    WeatherIconPipe,
    TemperatureColorPipe,
    TimeFormatPipe,
    WeatherDescriptionPipe,
    
    // Export directives
    WeatherHighlightDirective,
    CityValidatorDirective,
    TemperatureColorDirective
  ]
})
export class SharedModule { }
