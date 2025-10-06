import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherDescription',
  standalone: true
})
export class WeatherDescriptionPipe implements PipeTransform {
  transform(condition: string): string {
    const descriptions: { [key: string]: string } = {
      'Clear': 'Perfect weather for outdoor activities',
      'Mainly Clear': 'Mostly clear skies with great visibility',
      'Partly Cloudy': 'Mix of sun and clouds',
      'Overcast': 'Cloudy skies with limited sunshine',
      'Fog': 'Drive carefully with reduced visibility',
      'Rain': 'Don\'t forget your umbrella',
      'Snow': 'Bundle up and stay warm',
      'Thunderstorm': 'Stay indoors and avoid outdoor activities',
      'Drizzle': 'Light rain, perfect for a cozy day',
      'Showers': 'Intermittent rain showers expected'
    };
    
    return descriptions[condition] || 'Check local conditions for updates';
  }
}
