# WeatherCardComponent

## Overview
The `WeatherCardComponent` is a reusable presentation component that displays weather information in a visually appealing card format. It can display both current weather and forecast data with different layouts and styling.

## File Location
```
src/app/components/weather-card/
├── weather-card.component.ts
├── weather-card.component.html
└── weather-card.component.scss
```

## Component Architecture

### TypeScript Component (`weather-card.component.ts`)

```typescript
@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent
```

#### Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `weather` | `WeatherData` | ✅ | Weather data object to display |
| `isCurrent` | `boolean` | ❌ | Whether this is current weather (default: false) |

#### Key Methods

##### `getWeatherIcon(condition: string): string`
- **Purpose**: Maps weather conditions to emoji icons
- **Parameters**: `condition` - Weather condition string
- **Returns**: Emoji string representing the weather
- **Logic**: Uses string matching to determine appropriate icon

**Icon Mapping**:
```typescript
Clear/Sunny → ☀️
Cloud → ☁️
Rain → 🌧️
Snow → ❄️
Storm/Thunder → ⛈️
Fog/Mist → 🌫️
Default → 🌤️
```

##### `getTemperatureColor(temp: number): string`
- **Purpose**: Returns color based on temperature
- **Parameters**: `temp` - Temperature in Celsius
- **Returns**: Hex color string
- **Logic**: Temperature-based color coding

**Color Scale**:
```typescript
< 0°C → #3498db (Blue - Cold)
0-10°C → #5dade2 (Light Blue)
10-20°C → #58d68d (Green)
20-30°C → #f7dc6f (Yellow)
> 30°C → #e74c3c (Red - Hot)
```

##### `formatDate(dateString: string): string`
- **Purpose**: Formats ISO date string to readable format
- **Parameters**: `dateString` - ISO date string
- **Returns**: Formatted date string (e.g., "Mon, Dec 25")
- **Logic**: Uses JavaScript Date API with locale formatting

##### `formatTime(dateString: string): string`
- **Purpose**: Formats ISO date string to time format
- **Parameters**: `dateString` - ISO date string
- **Returns**: Formatted time string (e.g., "14:30")
- **Logic**: Extracts time portion with 24-hour format

## Template Structure (`weather-card.component.html`)

### Layout Hierarchy
```
weather-card
├── card-header
│   ├── location-info
│   │   ├── city-name
│   │   └── country
│   └── date-time
│       ├── date
│       └── time (conditional)
├── weather-main
│   ├── temperature-section
│   │   ├── temperature (dynamic color)
│   │   └── feels-like
│   └── weather-icon
├── weather-details
│   ├── condition
│   └── details-grid
│       ├── humidity
│       ├── wind
│       ├── pressure
│       └── visibility
└── temperature-range (conditional)
    ├── min-temp
    └── max-temp
```

### Conditional Rendering
- **`[class.current]="isCurrent"`**: Applies special styling for current weather
- **`*ngIf="isCurrent"`**: Shows time only for current weather
- **`*ngIf="!isCurrent"`**: Shows min/max temps only for forecast
- **`[style.color]="getTemperatureColor(weather.temperature)"`**: Dynamic temperature color

### Data Binding
- **Property Binding**: `[weather]`, `[isCurrent]`, `[style.color]`
- **Interpolation**: `{{ weather.city }}`, `{{ weather.temperature }}°C`
- **Method Calls**: `{{ getWeatherIcon(weather.condition) }}`

## Styling (`weather-card.component.scss`)

### Design System

#### Base Card Styles
```scss
.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### Current Weather Variant
```scss
&.current {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  transform: scale(1.02);
}
```

#### Hover Effects
```scss
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

### Layout Components

#### Header Section
- **Flexbox Layout**: Space-between for location and date
- **Typography**: Hierarchical font sizes and weights
- **Text Shadow**: Subtle shadow for better readability

#### Main Weather Section
- **Temperature Display**: Large, prominent temperature with dynamic color
- **Weather Icon**: Large emoji with opacity for visual balance
- **Feels Like**: Secondary temperature information

#### Details Grid
- **CSS Grid**: 2-column layout for weather details
- **Border Separators**: Subtle lines between detail items
- **Typography**: Consistent label-value pairing

#### Temperature Range (Forecast Only)
- **Min/Max Display**: Centered layout with clear labeling
- **Border Top**: Separates from main details

### Responsive Design

#### Mobile Breakpoints
```scss
@media (max-width: 768px) {
  .weather-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .weather-main {
    .temperature-section .temperature {
      font-size: 2.8rem;
    }
    
    .weather-icon {
      font-size: 3rem;
    }
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
```

## Data Flow

### Input Data Flow
```
Parent Component → @Input() weather → Template Rendering
```

### Method Execution Flow
```
Template → Method Call → Return Value → Template Display
```

### Styling Flow
```
Component State → Method → Color/Icon → CSS Class → Visual Output
```

## Reusability Features

### Flexible Display Modes
- **Current Weather**: Enhanced styling, time display, no min/max
- **Forecast Weather**: Standard styling, min/max temps, no time

### Dynamic Content
- **Weather Icons**: Automatic icon selection based on condition
- **Temperature Colors**: Visual temperature indication
- **Responsive Layout**: Adapts to different screen sizes

### Consistent Styling
- **Glassmorphism**: Modern glass-like appearance
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Hover effects and transitions

## Performance Considerations

### Optimization Strategies
- **OnPush Change Detection**: Could be implemented for better performance
- **Pure Pipes**: Could use pipes for formatting instead of methods
- **Memoization**: Could cache icon and color calculations

### Memory Management
- **No Subscriptions**: Component doesn't manage observables
- **Stateless Design**: Pure presentation component
- **Minimal Logic**: Simple methods with no side effects

## Testing Strategy

### Unit Tests
- **Method Testing**: Test icon, color, and formatting methods
- **Input Validation**: Test with different weather data
- **Conditional Rendering**: Test current vs forecast modes

### Visual Tests
- **Screenshot Testing**: Compare visual output
- **Responsive Testing**: Test different screen sizes
- **Accessibility Testing**: Test color contrast and readability

## Accessibility Features

### Semantic HTML
- **Proper Headings**: h3 for city names
- **Descriptive Labels**: Clear detail labels
- **Logical Structure**: Hierarchical information layout

### Visual Accessibility
- **Color Contrast**: High contrast text on gradient backgrounds
- **Text Shadows**: Enhanced readability
- **Responsive Text**: Scalable font sizes

### Keyboard Navigation
- **Focus Management**: Proper tab order
- **Interactive Elements**: Accessible buttons and inputs

## Future Enhancements

### Potential Features
- **Animation**: Weather condition animations
- **Charts**: Temperature trend visualization
- **Interactive Elements**: Click to expand details
- **Customization**: User-selectable themes
- **Accessibility**: Enhanced screen reader support

### Code Improvements
- **Pipes**: Convert methods to pure pipes
- **Directives**: Create custom directives for styling
- **Theming**: CSS custom properties for dynamic theming
- **Performance**: Virtual scrolling for large forecast lists
