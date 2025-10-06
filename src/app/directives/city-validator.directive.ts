import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCityValidator]',
  standalone: true
})
export class CityValidatorDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const value = event.target.value;
    const isValid = this.isValidCityName(value);
    
    if (isValid) {
      this.renderer.removeClass(this.el.nativeElement, 'invalid');
      this.renderer.addClass(this.el.nativeElement, 'valid');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'valid');
      this.renderer.addClass(this.el.nativeElement, 'invalid');
    }
  }

  @HostListener('blur', ['$event']) onBlur(event: any) {
    const value = event.target.value;
    if (value && !this.isValidCityName(value)) {
      this.renderer.addClass(this.el.nativeElement, 'invalid');
    }
  }

  private isValidCityName(city: string): boolean {
    return /^[a-zA-Z\s-']+$/.test(city) && city.length >= 2;
  }
}
