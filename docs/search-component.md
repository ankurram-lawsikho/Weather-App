# SearchComponent

## Overview
The `SearchComponent` provides an intuitive search interface for finding weather information by city name. It includes search input, suggestions dropdown, and quick access to recently searched cities.

## File Location
```
src/app/components/search/
├── search.component.ts
├── search.component.html
└── search.component.scss
```

## Component Architecture

### TypeScript Component (`search.component.ts`)

```typescript
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent
```

#### Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `savedCities` | `string[]` | ❌ | Array of recently searched cities |

#### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `citySearch` | `EventEmitter<string>` | Emitted when user searches for a city |
| `citySelect` | `EventEmitter<string>` | Emitted when user selects a saved city |

#### Component Properties

| Property | Type | Description |
|----------|------|-------------|
| `searchQuery` | `string` | Current search input value |
| `showSuggestions` | `boolean` | Controls suggestions dropdown visibility |

#### Key Methods

##### `onSearch()`
- **Purpose**: Handles search form submission
- **Actions**:
  1. Validates search query (non-empty)
  2. Emits `citySearch` event with trimmed query
  3. Clears search input
  4. Hides suggestions dropdown
- **Trigger**: Search button click or Enter key press

##### `onKeyPress(event: KeyboardEvent)`
- **Purpose**: Handles keyboard input for search
- **Parameters**: `event` - Keyboard event object
- **Actions**: Triggers search on Enter key press
- **Logic**: Checks for Enter key and calls `onSearch()`

##### `onInputFocus()`
- **Purpose**: Shows suggestions when input is focused
- **Actions**: Displays suggestions dropdown if saved cities exist
- **Trigger**: Input field focus event

##### `onInputBlur()`
- **Purpose**: Hides suggestions when input loses focus
- **Actions**: Delays hiding to allow clicking on suggestions
- **Logic**: Uses setTimeout to prevent immediate hiding

##### `selectCity(city: string)`
- **Purpose**: Handles city selection from suggestions
- **Parameters**: `city` - Selected city name
- **Actions**:
  1. Emits `citySelect` event
  2. Hides suggestions dropdown
- **Trigger**: Click on suggestion item

##### `get filteredCities(): string[]`
- **Purpose**: Computed property for filtered suggestions
- **Returns**: Array of cities matching current search query
- **Logic**: Filters saved cities based on search input

## Template Structure (`search.component.html`)

### Layout Hierarchy
```
search-container
├── search-box
│   ├── search-input-wrapper
│   │   ├── search-input (ngModel)
│   │   └── search-button
│   └── suggestions (conditional)
│       ├── suggestions-header
│       └── suggestion-item[] (ngFor)
└── quick-cities (conditional)
    ├── quick-label
    └── city-chips
        └── city-chip[] (ngFor)
```

### Form Integration
- **Two-Way Binding**: `[(ngModel)]="searchQuery"`
- **Event Handling**: `(keypress)`, `(focus)`, `(blur)`, `(click)`
- **Conditional Rendering**: `*ngIf` for suggestions and quick cities

### Data Binding
- **Property Binding**: `[savedCities]`, `[disabled]`
- **Event Binding**: `(citySearch)`, `(citySelect)`
- **Structural Directives**: `*ngFor`, `*ngIf`

## Styling (`search.component.scss`)

### Design System

#### Main Container
```scss
.search-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}
```

#### Search Input Wrapper
```scss
.search-input-wrapper {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
}
```

#### Search Input
```scss
.search-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  
  &::placeholder {
    color: #bdc3c7;
  }
}
```

#### Search Button
```scss
.search-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2980b9, #1f618d);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
}
```

### Suggestions Dropdown

#### Dropdown Container
```scss
.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}
```

#### Suggestion Items
```scss
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
}
```

### Quick Access Cities

#### City Chips
```scss
.city-chip {
  background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
}
```

## User Experience Features

### Search Functionality
- **Real-time Suggestions**: Shows filtered saved cities as user types
- **Keyboard Navigation**: Enter key triggers search
- **Input Validation**: Prevents empty searches
- **Visual Feedback**: Button disabled state for empty input

### Suggestions System
- **Smart Filtering**: Case-insensitive city name matching
- **Recent Cities**: Shows previously searched cities
- **Click to Select**: Easy city selection from suggestions
- **Auto-hide**: Suggestions hide after selection or blur

### Quick Access
- **City Chips**: Visual representation of saved cities
- **Hover Effects**: Interactive feedback on hover
- **Limited Display**: Shows maximum 5 recent cities
- **One-click Access**: Direct city selection

## Data Flow

### Search Flow
```
User Input → searchQuery → onSearch() → citySearch Event → Parent Component
```

### Selection Flow
```
User Click → selectCity() → citySelect Event → Parent Component
```

### Suggestions Flow
```
Input Focus → showSuggestions = true → filteredCities → Template Rendering
```

## State Management

### Local State
- **searchQuery**: Current input value
- **showSuggestions**: Dropdown visibility control

### Parent State
- **savedCities**: Array of recent cities (passed as input)
- **Event Handling**: Parent manages city selection and search

## Performance Considerations

### Optimization Strategies
- **Debounced Search**: Could implement debouncing for real-time filtering
- **Virtual Scrolling**: For large city lists
- **Caching**: Cache filtered results
- **Lazy Loading**: Load suggestions on demand

### Memory Management
- **No Subscriptions**: Component doesn't manage observables
- **Event Cleanup**: Proper event listener management
- **Minimal State**: Only essential local state

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Enter Key**: Triggers search action
- **Escape Key**: Could hide suggestions
- **Arrow Keys**: Could navigate suggestions

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for inputs
- **Role Attributes**: Proper roles for interactive elements
- **Live Regions**: Announce search results

### Visual Accessibility
- **High Contrast**: Good color contrast ratios
- **Focus Indicators**: Clear focus states
- **Responsive Text**: Scalable font sizes

## Testing Strategy

### Unit Tests
- **Method Testing**: Test search and selection methods
- **Input Validation**: Test empty and valid inputs
- **Event Emission**: Test event emission with correct data

### Integration Tests
- **Parent Communication**: Test event handling with parent
- **User Interactions**: Test complete search workflows
- **Keyboard Events**: Test keyboard navigation

### Visual Tests
- **Screenshot Testing**: Compare visual output
- **Responsive Testing**: Test different screen sizes
- **Accessibility Testing**: Test with screen readers

## Future Enhancements

### Potential Features
- **Autocomplete**: Real-time city suggestions from API
- **Geolocation**: "Use current location" option
- **Search History**: Extended search history management
- **Favorites**: User-defined favorite cities
- **Voice Search**: Speech-to-text search capability

### Code Improvements
- **Reactive Forms**: Convert to reactive forms for better validation
- **Custom Validators**: Add city name validation
- **Error Handling**: Better error states and recovery
- **Performance**: Implement debouncing and caching

### UX Improvements
- **Loading States**: Show loading during search
- **Error Messages**: Display search errors
- **Success Feedback**: Confirm successful searches
- **Keyboard Shortcuts**: Additional keyboard navigation
