import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperatureConverter',
  standalone: true
})
export class TemperatureConverterPipe implements PipeTransform {
  transform(celsius: number | undefined, unit: 'metric' | 'imperial' | 'celsius' | 'fahrenheit' = 'metric'): number {
    if (celsius === undefined || celsius === null) {
      return 0;
    }
    
    if (unit === 'fahrenheit' || unit === 'imperial') {
      // Convert Celsius to Fahrenheit: F = (C * 9/5) + 32
      return Math.round((celsius * 9/5) + 32);
    }
    // Return Celsius as is (for 'celsius' or 'metric')
    return Math.round(celsius);
  }
}
