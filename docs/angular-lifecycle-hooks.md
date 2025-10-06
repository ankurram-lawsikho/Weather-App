# Angular Lifecycle Hooks Implementation

## Overview
This document demonstrates the implementation of all Angular lifecycle hooks in the Weather Dashboard application. Each hook is used in real-world scenarios to manage component state, handle cleanup, and optimize performance.

## Lifecycle Hook Execution Sequence

Angular lifecycle hooks execute in a specific order during component initialization, updates, and destruction:

1. **ngOnChanges** - Input properties change
2. **ngOnInit** - Component initialization
3. **ngDoCheck** - Custom change detection
4. **ngAfterContentInit** - Content projection initialization
5. **ngAfterContentChecked** - Content projection checking
6. **ngAfterViewInit** - View initialization
7. **ngAfterViewChecked** - View checking
8. **ngOnDestroy** - Component cleanup

## Implementation Details

### 1. ngOnChanges - Input Property Changes

**Location:** `WeatherCardComponent`

**Purpose:** Detect and react to changes in @Input properties

**Implementation:**
```typescript
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
```

**Real-world Use Case:** When the parent component updates weather data, the card reacts to changes and can trigger animations or updates.

**When it fires:** Every time an @Input property changes (except on first initialization).

---

### 2. ngOnInit - Component Initialization

**Location:** `WeatherDashboardComponent`

**Purpose:** Initialize component data and perform setup tasks

**Implementation:**
```typescript
ngOnInit() {
  console.log('🔄 WeatherDashboard ngOnInit');
  this.loadSavedCities();
  this.getWeatherByCity('London');
}
```

**Real-world Use Case:** Load saved cities from localStorage and fetch default weather data for London.

**When it fires:** Once after the first ngOnChanges (if inputs exist) or immediately if no inputs.

---

### 3. ngDoCheck - Custom Change Detection

**Location:** `WeatherCardComponent`

**Purpose:** Implement custom change detection logic

**Implementation:**
```typescript
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
```

**Real-world Use Case:** Detect deep object changes that Angular's default change detection might miss, such as nested property changes in weather data.

**When it fires:** During every change detection cycle (can be frequent, so use carefully).

---

### 4. ngAfterContentInit - Content Projection Initialization

**Location:** `WeatherCardWrapperComponent`

**Purpose:** Initialize after content is projected into the component

**Implementation:**
```typescript
ngAfterContentInit() {
  console.log('🔄 WeatherCardWrapper ngAfterContentInit - content projected');
  
  if (this.weatherCard) {
    console.log('Weather card content initialized:', this.weatherCard);
    this.setupCardInteractions();
  }
}
```

**Real-world Use Case:** Set up interactions with projected content, access projected components, or initialize wrapper-specific logic.

**When it fires:** Once after the first ngDoCheck, when projected content is initialized.

---

### 5. ngAfterContentChecked - Content Projection Checking

**Location:** `WeatherCardWrapperComponent`

**Purpose:** React to changes in projected content

**Implementation:**
```typescript
ngAfterContentChecked() {
  this.lastUpdated = new Date().toLocaleTimeString();
  console.log('🔄 WeatherCardWrapper ngAfterContentChecked - content checked');
}
```

**Real-world Use Case:** Update wrapper component state based on projected content changes, such as updating timestamps or status indicators.

**When it fires:** After every ngDoCheck, when projected content is checked.

---

### 6. ngAfterViewInit - View Initialization

**Location:** `WeatherDashboardComponent`

**Purpose:** Access DOM elements after view is initialized

**Implementation:**
```typescript
ngAfterViewInit() {
  console.log('🔄 WeatherDashboard ngAfterViewInit - view is ready');
  
  if (this.weatherContainer) {
    console.log('Weather container element:', this.weatherContainer.nativeElement);
    this.initializeWeatherAnimations();
  }
}
```

**Real-world Use Case:** Initialize third-party libraries, set up DOM event listeners, or access ViewChild elements.

**When it fires:** Once after the first ngAfterContentChecked, when the component's view is initialized.

---

### 7. ngAfterViewChecked - View Checking

**Location:** `SearchComponent`

**Purpose:** React to view changes after each change detection cycle

**Implementation:**
```typescript
ngAfterViewChecked() {
  console.log('🔄 SearchComponent ngAfterViewChecked - view checked');
  
  if (this.searchQuery !== this.lastSearchQuery) {
    console.log('Search query changed:', this.searchQuery);
    this.lastSearchQuery = this.searchQuery;
    this.updateSearchSuggestions();
  }
}
```

**Real-world Use Case:** React to view changes, update UI elements, or perform DOM manipulations after change detection.

**When it fires:** After every ngAfterContentChecked, when the component's view is checked.

---

### 8. ngOnDestroy - Component Cleanup

**Location:** `WeatherDashboardComponent`

**Purpose:** Clean up resources and prevent memory leaks

**Implementation:**
```typescript
ngOnDestroy() {
  console.log('🔄 WeatherDashboard ngOnDestroy - cleaning up subscriptions');
  this.destroy$.next();
  this.destroy$.complete();
}
```

**Real-world Use Case:** Unsubscribe from observables, clear timers, remove event listeners, or clean up any resources to prevent memory leaks.

**When it fires:** Just before the component is destroyed and removed from the DOM.

## Console Output Sequence

When the application loads, you'll see this sequence in the browser console:

```
🔄 WeatherDashboard ngOnInit
🔄 WeatherCard ngOnChanges (initial)
🔄 WeatherCard ngDoCheck
🔄 SearchComponent ngAfterViewChecked
🔄 WeatherCardWrapper ngAfterContentInit
🔄 WeatherCardWrapper ngAfterContentChecked
🔄 WeatherCard ngAfterViewChecked
🔄 WeatherDashboard ngAfterViewInit
🔄 WeatherCard ngDoCheck (subsequent checks)
🔄 SearchComponent ngAfterViewChecked (subsequent checks)
🔄 WeatherCardWrapper ngAfterContentChecked (subsequent checks)
🔄 WeatherCard ngAfterViewChecked (subsequent checks)
```

## Memory Management

### Subscription Cleanup
The `WeatherDashboardComponent` uses the `takeUntil` pattern to prevent memory leaks:

```typescript
this.weatherService.getCurrentWeather(city)
  .pipe(takeUntil(this.destroy$))
  .subscribe({...});
```

This ensures that when the component is destroyed, all active subscriptions are automatically unsubscribed.

### Change Detection Optimization
The `ngDoCheck` implementation uses `KeyValueDiffers` to efficiently detect object changes:

```typescript
constructor(private differs: KeyValueDiffers) {
  this.differ = this.differs.find({}).create();
}
```

## Best Practices Demonstrated

1. **Initialization Logic**: Use `ngOnInit` for component setup
2. **Input Changes**: Use `ngOnChanges` to react to property changes
3. **View Access**: Use `ngAfterViewInit` to access DOM elements
4. **Content Projection**: Use content hooks for wrapper components
5. **Cleanup**: Always implement `ngOnDestroy` for resource cleanup
6. **Performance**: Use `ngDoCheck` carefully to avoid performance issues
7. **Change Detection**: Implement custom change detection when needed

## Performance Considerations

- **ngDoCheck** and **ngAfterViewChecked** run frequently - keep them lightweight
- Use `OnPush` change detection strategy when possible
- Implement proper cleanup in `ngOnDestroy` to prevent memory leaks
- Use `KeyValueDiffers` for efficient object change detection

## Testing Lifecycle Hooks

Each lifecycle hook can be tested independently:

```typescript
it('should call ngOnInit', () => {
  spyOn(component, 'ngOnInit');
  component.ngOnInit();
  expect(component.ngOnInit).toHaveBeenCalled();
});

it('should handle ngOnDestroy', () => {
  spyOn(component, 'ngOnDestroy');
  component.ngOnDestroy();
  expect(component.ngOnDestroy).toHaveBeenCalled();
});
```

## Summary

This implementation demonstrates all Angular lifecycle hooks in a real-world weather dashboard application. Each hook serves a specific purpose:

- **Initialization**: ngOnInit, ngAfterViewInit, ngAfterContentInit
- **Change Detection**: ngOnChanges, ngDoCheck, ngAfterViewChecked, ngAfterContentChecked  
- **Cleanup**: ngOnDestroy

The hooks work together to provide a complete lifecycle management system for Angular components, ensuring proper initialization, efficient change detection, and clean resource management.
