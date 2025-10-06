import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperatureColor',
  standalone: true
})
export class TemperatureColorPipe implements PipeTransform {
  transform(temp: number): string {
    if (temp < 0) return '#3498db'; // Blue for cold
    if (temp < 10) return '#5dade2'; // Light blue
    if (temp < 20) return '#58d68d'; // Green
    if (temp < 30) return '#f7dc6f'; // Yellow
    return '#e74c3c'; // Red for hot
  }
}
