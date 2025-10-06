import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTemperatureColor]',
  standalone: true
})
export class TemperatureColorDirective implements OnChanges {
  @Input() appTemperatureColor: number | string | undefined = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appTemperatureColor']) {
      const color = this.getTemperatureColor(this.appTemperatureColor);
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'color 0.3s ease');
    }
  }

  private getTemperatureColor(temp: number | string | undefined): string {
    if (temp === undefined) return '#2c3e50'; // Default color for undefined
    
    // Convert string to number if needed
    const numericTemp = typeof temp === 'string' ? parseFloat(temp) : temp;
    
    // Check if conversion was successful
    if (isNaN(numericTemp)) return '#2c3e50'; // Default color for invalid numbers
    
    if (numericTemp < 0) return '#3498db'; // Blue for cold
    if (numericTemp < 10) return '#5dade2'; // Light blue
    if (numericTemp < 20) return '#58d68d'; // Green
    if (numericTemp < 30) return '#f7dc6f'; // Yellow
    return '#e74c3c'; // Red for hot
  }
}
