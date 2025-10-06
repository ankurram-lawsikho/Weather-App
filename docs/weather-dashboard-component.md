# WeatherDashboardComponent

## Overview
The `WeatherDashboardComponent` is the main container component that orchestrates the entire weather dashboard application. It manages the overall state, coordinates between child components, and handles the primary data flow.

## File Location
```
src/app/components/weather-dashboard/
├── weather-dashboard.component.ts
├── weather-dashboard.component.html
└── weather-dashboard.component.scss
```

## Component Architecture

### TypeScript Component (`weather-dashboard.component.ts`)

```typescript
@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent, SearchComponent],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent implements OnInit
```

#### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentWeather` | `WeatherData \| null` | Current weather data for selected city |
| `forecast` | `WeatherData[]` | 5-day weather forecast array |
| `loading` | `boolean` | Loading state for API calls |
| `error` | `string \| null` | Error message for failed requests |
| `savedCities` | `string[]` | Array of recently searched cities |

#### Key Methods

##### `ngOnInit()`
- **Purpose**: Component initialization
- **Actions**:
  - Loads saved cities from localStorage
  - Fetches initial weather data for London
- **Lifecycle**: Called once after component creation

##### `onCitySearch(city: string)`
- **Purpose**: Handles city search from SearchComponent
- **Parameters**: `city` - The city name to search for
- **Actions**: Calls `getWeatherByCity()` to fetch weather data

##### `onCitySelect(city: string)`
- **Purpose**: Handles city selection from saved cities
- **Parameters**: `city` - The selected city name
- **Actions**: Calls `getWeatherByCity()` to fetch weather data

##### `getWeatherByCity(city: string)` (Private)
- **Purpose**: Core method for fetching weather data
- **Parameters**: `city` - The city name to fetch weather for
- **Actions**:
  1. Sets loading state to true
  2. Clears any previous errors
  3. Calls weather service for current weather
  4. Calls weather service for forecast
  5. Handles success/error responses
  6. Updates component state

##### `addToSavedCities(city: string)` (Private)
- **Purpose**: Manages recently searched cities
- **Parameters**: `city` - City name to add
- **Actions**:
  - Adds city to beginning of array
  - Limits to 5 cities maximum
  - Saves to localStorage

## Template Structure (`weather-dashboard.component.html`)

### Layout Hierarchy
```
weather-dashboard
├── dashboard-header
│   ├── h1 (title)
│   ├── p (subtitle)
│   └── demo-notice (API key info)
├── search-section
│   └── app-search (search component)
├── content (conditional)
│   ├── current-weather-section
│   │   └── app-weather-card (current weather)
│   └── forecast-section
│       └── forecast-grid
│           └── app-weather-card[] (forecast cards)
├── loading (conditional)
│   └── spinner + message
└── error (conditional)
    └── error message + retry button
```

### Conditional Rendering
- **`*ngIf="!loading && !error"`**: Shows main content when not loading and no errors
- **`*ngIf="loading"`**: Shows loading spinner during API calls
- **`*ngIf="error"`**: Shows error message with retry option
- **`*ngIf="currentWeather"`**: Shows current weather when data is available
- **`*ngIf="forecast.length > 0"`**: Shows forecast when data is available

## Styling (`weather-dashboard.component.scss`)

### Design System
- **Color Palette**: Gradient backgrounds with glassmorphism effects
- **Typography**: Segoe UI font family with proper hierarchy
- **Spacing**: Consistent margin/padding using rem units
- **Responsive**: Mobile-first design with breakpoints

### Key Styles
- **`.weather-dashboard`**: Main container with max-width and centering
- **`.dashboard-header`**: Centered header with gradient text
- **`.demo-notice`**: Glassmorphism card for API key information
- **`.forecast-grid`**: CSS Grid for responsive forecast layout
- **`.loading`**: Centered spinner with animation
- **`.error`**: Error state with retry button

## Data Flow

### 1. Component Initialization
```
ngOnInit() → loadSavedCities() → getWeatherByCity('London')
```

### 2. User Search Flow
```
User types city → SearchComponent → onCitySearch() → getWeatherByCity()
```

### 3. City Selection Flow
```
User clicks saved city → SearchComponent → onCitySelect() → getWeatherByCity()
```

### 4. Weather Data Flow
```
getWeatherByCity() → WeatherService → API → Response → Component State → Template
```

## State Management

### Local State
- **Component Properties**: Manage UI state and data
- **Loading States**: Control spinner and disable interactions
- **Error Handling**: Display user-friendly error messages

### Persistent State
- **localStorage**: Saves recently searched cities
- **Session Persistence**: Cities persist across browser sessions

## Error Handling

### Error Types
1. **API Errors**: Network failures, invalid API keys
2. **Data Errors**: Invalid city names, malformed responses
3. **User Errors**: Empty search queries

### Error Recovery
- **Retry Button**: Allows users to retry failed requests
- **Fallback Data**: Demo service provides sample data
- **User Feedback**: Clear error messages with actionable steps

## Performance Considerations

### Optimization Strategies
- **OnPush Change Detection**: Could be implemented for better performance
- **Lazy Loading**: Components loaded only when needed
- **Debounced Search**: Prevents excessive API calls
- **Caching**: localStorage caches recent searches

### Memory Management
- **Subscription Cleanup**: Properly unsubscribe from observables
- **Component Destruction**: Clean up resources in ngOnDestroy

## Testing Strategy

### Unit Tests
- **Component Logic**: Test methods and state changes
- **Service Integration**: Mock weather service responses
- **Error Scenarios**: Test error handling paths

### Integration Tests
- **Component Communication**: Test parent-child interactions
- **User Flows**: Test complete search and display workflows
- **API Integration**: Test with real API responses

## Future Enhancements

### Potential Features
- **Geolocation**: Auto-detect user location
- **Weather Maps**: Visual weather representation
- **Alerts**: Weather warning notifications
- **Historical Data**: Past weather information
- **Multiple Cities**: Compare weather across locations
- **Offline Support**: Service worker for offline functionality

### Code Improvements
- **State Management**: Implement NgRx for complex state
- **Caching**: Add HTTP interceptors for response caching
- **PWA**: Convert to Progressive Web App
- **Accessibility**: Enhanced ARIA labels and keyboard navigation
