import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, catchError, throwError } from 'rxjs';
import { 
  WeatherData, 
  GeocodingResponse, 
  OpenMeteoCurrentResponse, 
  OpenMeteoForecastResponse 
} from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // OpenStreetMap Nominatim API for geocoding (no API key required)
  private readonly GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';
  
  // Open-Meteo API for weather data (no API key required)
  private readonly OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherData> {
    return this.getCoordinates(city).pipe(
      switchMap(coords => this.getCurrentWeatherByCoordinates(coords.lat, coords.lon, city, coords.country))
    );
  }

  getForecast(city: string): Observable<WeatherData[]> {
    return this.getCoordinates(city).pipe(
      switchMap(coords => this.getForecastByCoordinates(coords.lat, coords.lon, city, coords.country))
    );
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData> {
    return this.getCurrentWeatherByCoordinates(lat, lon, '', '');
  }

  private getCoordinates(city: string): Observable<{ lat: number; lon: number; country: string; cityName: string }> {
    const params = new HttpParams()
      .set('q', city)
      .set('format', 'json')
      .set('limit', '1')
      .set('addressdetails', '1');

    return this.http.get<GeocodingResponse[]>(this.GEOCODING_URL, { params }).pipe(
      map(response => {
        if (!response || response.length === 0) {
          throw new Error(`City "${city}" not found`);
        }
        
        const result = response[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          country: result.address.country || '',
          cityName: result.address.city || result.address.town || result.address.village || city
        };
      }),
      catchError(error => {
        console.error('Geocoding error:', error);
        return throwError(() => new Error(`Failed to find coordinates for "${city}"`));
      })
    );
  }

  private getCurrentWeatherByCoordinates(
    lat: number, 
    lon: number, 
    cityName: string, 
    country: string
  ): Observable<WeatherData> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,uv_index,is_day,sunshine_duration')
      .set('timezone', 'auto');

    return this.http.get<OpenMeteoCurrentResponse>(this.OPEN_METEO_URL, { params }).pipe(
      map(response => this.transformOpenMeteoCurrentResponse(response, cityName, country)),
      catchError(error => {
        console.error('Open-Meteo API error:', error);
        return throwError(() => new Error('Failed to fetch weather data'));
      })
    );
  }

  private getForecastByCoordinates(
    lat: number, 
    lon: number, 
    cityName: string, 
    country: string
  ): Observable<WeatherData[]> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,shortwave_radiation_sum,uv_index_max,sunshine_duration')
      .set('timezone', 'auto')
      .set('forecast_days', '5');

    return this.http.get<OpenMeteoForecastResponse>(this.OPEN_METEO_URL, { params }).pipe(
      map(response => this.transformOpenMeteoForecastResponse(response, cityName, country)),
      catchError(error => {
        console.error('Open-Meteo Forecast API error:', error);
        return throwError(() => new Error('Failed to fetch forecast data'));
      })
    );
  }

  private transformOpenMeteoCurrentResponse(
    response: OpenMeteoCurrentResponse, 
    cityName: string, 
    country: string
  ): WeatherData {
    return {
      city: cityName,
      country: country,
      date: response.current.time,
      temperature: Math.round(response.current.temperature_2m),
      feelsLike: Math.round(response.current.apparent_temperature),
      condition: this.getWeatherCondition(response.current.weather_code),
      description: this.getWeatherDescription(response.current.weather_code),
      humidity: response.current.relative_humidity_2m,
      windSpeed: Math.round(response.current.wind_speed_10m * 3.6), // Convert m/s to km/h
      windDirection: response.current.wind_direction_10m,
      pressure: Math.round(response.current.pressure_msl),
      visibility: Math.round(response.current.visibility / 1000), // Convert m to km
      uvIndex: response.current.uv_index
    };
  }

  private transformOpenMeteoForecastResponse(
    response: OpenMeteoForecastResponse, 
    cityName: string, 
    country: string
  ): WeatherData[] {
    return response.daily.time.map((date, index) => ({
      city: cityName,
      country: country,
      date: date,
      temperature: Math.round((response.daily.temperature_2m_max[index] + response.daily.temperature_2m_min[index]) / 2),
      feelsLike: Math.round((response.daily.apparent_temperature_max[index] + response.daily.apparent_temperature_min[index]) / 2),
      minTemp: Math.round(response.daily.temperature_2m_min[index]),
      maxTemp: Math.round(response.daily.temperature_2m_max[index]),
      condition: this.getWeatherCondition(response.daily.weather_code[index]),
      description: this.getWeatherDescription(response.daily.weather_code[index]),
      humidity: 0, // Removed from forecast
      windSpeed: 0, // Removed from forecast
      windDirection: 0, // Removed from forecast
      pressure: 0, // Removed from forecast
      visibility: 0, // Removed from forecast
      uvIndex: response.daily.uv_index_max[index]
    }));
  }

  private getWeatherCondition(weatherCode: number): string {
    // Open-Meteo weather codes mapping
    const weatherConditions: { [key: number]: string } = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      56: 'Light Freezing Drizzle',
      57: 'Dense Freezing Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      66: 'Light Freezing Rain',
      67: 'Heavy Freezing Rain',
      71: 'Slight Snow Fall',
      73: 'Moderate Snow Fall',
      75: 'Heavy Snow Fall',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Slight Hail',
      99: 'Thunderstorm with Heavy Hail'
    };
    
    return weatherConditions[weatherCode] || 'Unknown';
  }

  private getWeatherDescription(weatherCode: number): string {
    // More detailed descriptions for weather codes
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear sky',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy conditions',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return weatherDescriptions[weatherCode] || 'Unknown weather condition';
  }
}
