import { Component, EventEmitter, Input, Output, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CityValidatorDirective } from '../../directives/city-validator.directive';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CityValidatorDirective],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewChecked {
  @Input() savedCities: string[] = [];
  @Output() citySearch = new EventEmitter<string>();
  @Output() citySelect = new EventEmitter<string>();
  
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  searchQuery: string = '';
  showSuggestions: boolean = false;
  private lastSearchQuery: string = '';

  ngAfterViewChecked() {
    console.log('🔄 SearchComponent ngAfterViewChecked - view checked');
    
    // Only log when search query actually changes
    if (this.searchQuery !== this.lastSearchQuery) {
      console.log('Search query changed:', this.searchQuery);
      this.lastSearchQuery = this.searchQuery;
      this.updateSearchSuggestions();
    }
  }

  private updateSearchSuggestions() {
    console.log('Updating search suggestions...');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.citySearch.emit(this.searchQuery.trim());
      this.searchQuery = '';
      this.showSuggestions = false;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onInputFocus() {
    if (this.savedCities.length > 0) {
      this.showSuggestions = true;
    }
  }

  onInputBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectCity(city: string) {
    this.citySelect.emit(city);
    this.showSuggestions = false;
  }

  get filteredCities(): string[] {
    if (!this.searchQuery.trim()) {
      return this.savedCities;
    }
    return this.savedCities.filter(city => 
      city.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
