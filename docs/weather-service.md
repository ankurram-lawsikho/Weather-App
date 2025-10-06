# WeatherService

## Overview
The `WeatherService` is responsible for all external API communication with OpenStreetMap (for geocoding) and Open-Meteo (for weather data). It handles HTTP requests, data transformation, and error management for weather data retrieval. **No API keys are required** as both services are free to use.

## File Location
```
src/app/services/weather.service.ts
```

## Service Architecture

### Service Definition
```typescript
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // OpenStreetMap Nominatim API for geocoding (no API key required)
  private readonly GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';
  
  // Open-Meteo API for weather data (no API key required)
  private readonly OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
}
```

### Configuration Properties

| Property | Type | Description |
|----------|------|-------------|
| `GEOCODING_URL` | `string` | OpenStreetMap Nominatim API for city-to-coordinates conversion |
| `OPEN_METEO_URL` | `string` | Open-Meteo API for weather data |

## API Methods

### `getCurrentWeather(city: string): Observable<WeatherData>`

#### Purpose
Fetches current weather data for a specified city using a two-step process:
1. Convert city name to coordinates using OpenStreetMap
2. Fetch weather data using coordinates from Open-Meteo

#### Parameters
- **`city`**: City name (string) - e.g., "London", "New York", "Tokyo"

#### Implementation
```typescript
getCurrentWeather(city: string): Observable<WeatherData> {
  return this.getCoordinates(city).pipe(
    switchMap(coords => this.getCurrentWeatherByCoordinates(coords.lat, coords.lon, city, coords.country))
  );
}
```

#### Process Flow
1. **Geocoding**: City name → Latitude/Longitude (OpenStreetMap)
2. **Weather Data**: Coordinates → Current weather (Open-Meteo)
3. **Data Transformation**: API response → WeatherData format

### `getForecast(city: string): Observable<WeatherData[]>`

#### Purpose
Fetches 5-day weather forecast for a specified city using the same two-step process.

#### Parameters
- **`city`**: City name (string)

#### Implementation
```typescript
getForecast(city: string): Observable<WeatherData[]> {
  return this.getCoordinates(city).pipe(
    switchMap(coords => this.getForecastByCoordinates(coords.lat, coords.lon, city, coords.country))
  );
}
```

### `getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData>`

#### Purpose
Fetches current weather data using geographic coordinates directly.

#### Parameters
- **`lat`**: Latitude (number)
- **`lon`**: Longitude (number)

#### Use Cases
- Geolocation-based weather
- Map-based city selection
- GPS coordinates from mobile devices

## Private Helper Methods

### `getCoordinates(city: string): Observable<{lat: number, lon: number, country: string, cityName: string}>`

#### Purpose
Converts city name to geographic coordinates using OpenStreetMap Nominatim API.

#### API Endpoint
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Method**: GET
- **Parameters**:
  - `q`: City name
  - `format`: json
  - `limit`: 1
  - `addressdetails`: 1

#### Response Structure
```typescript
{
  place_id: number;
  lat: string;           // Latitude as string
  lon: string;           // Longitude as string
  display_name: string;  // Full address
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
}
```

### `getCurrentWeatherByCoordinates(lat, lon, cityName, country): Observable<WeatherData>`

#### Purpose
Fetches current weather data from Open-Meteo API using coordinates.

#### API Endpoint
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Method**: GET
- **Parameters**:
  - `latitude`: Latitude coordinate
  - `longitude`: Longitude coordinate
  - `current`: Comma-separated list of weather parameters
  - `timezone`: auto

#### Current Weather Parameters
- `temperature_2m`: Temperature at 2m height
- `relative_humidity_2m`: Relative humidity at 2m height
- `apparent_temperature`: Apparent temperature (feels like)
- `precipitation`: Precipitation amount
- `weather_code`: Weather condition code
- `cloud_cover`: Cloud cover percentage
- `pressure_msl`: Atmospheric pressure at mean sea level
- `wind_speed_10m`: Wind speed at 10m height
- `wind_direction_10m`: Wind direction at 10m height
- `visibility`: Visibility distance
- `uv_index`: UV index
- `is_day`: Day/night indicator

### `getForecastByCoordinates(lat, lon, cityName, country): Observable<WeatherData[]>`

#### Purpose
Fetches 5-day weather forecast from Open-Meteo API using coordinates.

#### API Endpoint
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Method**: GET
- **Parameters**:
  - `latitude`: Latitude coordinate
  - `longitude`: Longitude coordinate
  - `daily`: Comma-separated list of daily parameters
  - `timezone`: auto
  - `forecast_days`: 5

#### Daily Forecast Parameters
- `weather_code`: Weather condition code
- `temperature_2m_max`: Maximum temperature
- `temperature_2m_min`: Minimum temperature
- `apparent_temperature_max`: Maximum apparent temperature
- `apparent_temperature_min`: Minimum apparent temperature
- `precipitation_sum`: Total precipitation
- `uv_index_max`: Maximum UV index
- `sunshine_duration`: Sunshine duration

## Data Transformation Methods

### `transformOpenMeteoCurrentResponse(response, cityName, country): WeatherData`

#### Purpose
Converts Open-Meteo current weather API response to application's `WeatherData` format.

#### Input Structure (OpenMeteoCurrentResponse)
```typescript
{
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;                    // ISO timestamp
    temperature_2m: number;          // Temperature in Celsius
    relative_humidity_2m: number;    // Humidity percentage
    apparent_temperature: number;    // Feels like temperature
    weather_code: number;            // Weather condition code
    cloud_cover: number;             // Cloud cover percentage
    pressure_msl: number;            // Pressure in hPa
    wind_speed_10m: number;          // Wind speed in m/s
    wind_direction_10m: number;      // Wind direction in degrees
    visibility: number;              // Visibility in meters
    uv_index: number;                // UV index
  };
}
```

#### Output Structure (WeatherData)
```typescript
{
  city: string;          // City name
  country: string;       // Country name
  date: string;          // ISO date string
  temperature: number;   // Rounded temperature
  feelsLike: number;     // Rounded feels like
  condition: string;     // Weather condition (from weather code)
  description: string;   // Weather description (from weather code)
  humidity: number;      // Humidity percentage
  windSpeed: number;     // Wind speed (km/h)
  windDirection: number; // Wind direction
  pressure: number;      // Atmospheric pressure
  visibility: number;    // Visibility (km)
  uvIndex: number;       // UV index
}
```

#### Key Transformations
- **Temperature Rounding**: `Math.round(response.current.temperature_2m)`
- **Wind Speed Conversion**: `Math.round(response.current.wind_speed_10m * 3.6)` (m/s to km/h)
- **Visibility Conversion**: `Math.round(response.current.visibility / 1000)` (m to km)
- **Weather Code Mapping**: Converts numeric codes to human-readable conditions

### `transformOpenMeteoForecastResponse(response, cityName, country): WeatherData[]`

#### Purpose
Converts 5-day forecast API response to array of `WeatherData` objects.

#### Input Structure (OpenMeteoForecastResponse)
```typescript
{
  daily: {
    time: string[];                  // Array of dates
    weather_code: number[];          // Weather condition codes
    temperature_2m_max: number[];    // Maximum temperatures
    temperature_2m_min: number[];    // Minimum temperatures
    apparent_temperature_max: number[]; // Max apparent temperatures
    apparent_temperature_min: number[]; // Min apparent temperatures
    uv_index_max: number[];          // Maximum UV indices
  };
}
```

#### Processing Logic
1. **Map Daily Data**: Convert each day's data to WeatherData format
2. **Calculate Average Temperature**: (max + min) / 2
3. **Weather Code Mapping**: Convert numeric codes to conditions
4. **Simplified Data**: Forecast cards show only essential information

#### Forecast Data Structure
- **Temperature**: Average of min/max temperatures
- **Min/Max Temperature**: Daily extremes
- **Weather Condition**: Human-readable condition from weather code
- **UV Index**: Maximum daily UV index
- **Simplified Fields**: Humidity, wind, pressure, visibility set to 0 for forecast cards

### Weather Code Mapping

#### `getWeatherCondition(weatherCode: number): string`
Converts Open-Meteo weather codes to human-readable conditions.

#### Weather Codes (0-99)
- **0**: Clear
- **1**: Mainly Clear
- **2**: Partly Cloudy
- **3**: Overcast
- **45**: Fog
- **51-55**: Drizzle (Light to Dense)
- **61-65**: Rain (Slight to Heavy)
- **71-75**: Snow Fall (Slight to Heavy)
- **80-82**: Rain Showers (Slight to Violent)
- **85-86**: Snow Showers (Slight to Heavy)
- **95**: Thunderstorm
- **96-99**: Thunderstorm with Hail

#### `getWeatherDescription(weatherCode: number): string`
Provides detailed descriptions for weather codes.

## Error Handling

### HTTP Error Types
- **Network Errors**: Connection failures, timeouts
- **Geocoding Errors**: City not found, invalid city names
- **Weather API Errors**: Invalid coordinates, service unavailable
- **Data Errors**: Malformed responses, missing fields

### Error Propagation
- **Observable Errors**: Errors bubble up to component level
- **Component Handling**: Components handle errors with user-friendly messages
- **Specific Error Messages**: Different messages for geocoding vs weather API errors

### Common Error Scenarios
- **Invalid City**: "City not found" errors from geocoding
- **Network Issues**: Connection problems with either API
- **Service Unavailable**: Open-Meteo or OpenStreetMap service down
- **Invalid Coordinates**: Malformed coordinate data

## Performance Considerations

### Optimization Strategies
- **Two-Step Process**: Efficient geocoding followed by weather data
- **Error Caching**: Cache geocoding results to avoid repeated lookups
- **Request Debouncing**: Prevent rapid successive requests
- **Coordinate Caching**: Cache city-to-coordinate mappings

### API Usage Optimization
- **No Rate Limits**: Both APIs are free with generous limits
- **Efficient Parameters**: Only request needed weather parameters
- **Timezone Handling**: Automatic timezone detection
- **Coordinate Precision**: Use appropriate coordinate precision

## Security Considerations

### No API Key Management
- **Free Services**: Both OpenStreetMap and Open-Meteo are free
- **No Authentication**: No API keys required
- **Public APIs**: Services are designed for public use
- **Rate Limiting**: Built-in rate limiting on both services

### Data Validation
- **Input Sanitization**: Validate city names and coordinates
- **Response Validation**: Validate API response structure
- **Type Safety**: Use TypeScript interfaces for validation
- **Error Boundaries**: Graceful handling of invalid data

## Testing Strategy

### Unit Tests
- **Method Testing**: Test each service method
- **Data Transformation**: Test response transformation logic
- **Error Scenarios**: Test error handling paths
- **Mock HTTP**: Use HttpClientTestingModule

### Integration Tests
- **API Integration**: Test with real APIs (no keys needed)
- **Error Handling**: Test network failures and API errors
- **Data Flow**: Test complete data transformation pipeline
- **Geocoding Flow**: Test city-to-coordinates conversion

### Mock Testing
- **HTTP Mocks**: Mock HTTP responses for testing
- **Error Mocks**: Mock various error scenarios
- **Data Mocks**: Mock API response data
- **Coordinate Mocks**: Mock geocoding responses

## Future Enhancements

### Additional API Methods
- **Hourly Forecast**: 24-hour detailed forecast
- **Weather Alerts**: Severe weather warnings
- **Historical Data**: Past weather information
- **Air Quality**: Pollution and air quality data
- **Marine Weather**: Ocean and coastal weather

### Performance Improvements
- **Caching**: Implement response caching
- **Offline Support**: Cache data for offline use
- **Background Sync**: Update data in background
- **Progressive Loading**: Load data progressively

### Error Handling Improvements
- **Retry Logic**: Automatic retry on failures
- **Fallback Data**: Use cached data on API failures
- **User Notifications**: Better error messaging
- **Recovery Actions**: Suggest actions for errors

### Additional Features
- **Multiple Cities**: Support for multiple city tracking
- **Weather Maps**: Integration with weather map services
- **Notifications**: Weather alerts and notifications
- **Widgets**: Weather widgets for different use cases