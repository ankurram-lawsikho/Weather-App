import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your weather dashboard experience</p>
      </div>
      
      <div class="settings-content">
        <div class="settings-section">
          <h2>Display Preferences</h2>
          
          <div class="setting-item">
            <label for="defaultCity">Default City:</label>
            <input 
              id="defaultCity"
              type="text" 
              [(ngModel)]="settings.defaultCity" 
              placeholder="Enter default city"
              class="setting-input">
          </div>
          
          <div class="setting-item">
            <label for="temperatureUnit">Temperature Unit:</label>
            <select 
              id="temperatureUnit"
              [(ngModel)]="settings.temperatureUnit" 
              class="setting-select">
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label for="windUnit">Wind Speed Unit:</label>
            <select 
              id="windUnit"
              [(ngModel)]="settings.windUnit" 
              class="setting-select">
              <option value="kmh">km/h</option>
              <option value="mph">mph</option>
              <option value="ms">m/s</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h2>Appearance</h2>
          
          <div class="setting-item">
            <label for="theme">Theme:</label>
            <select 
              id="theme"
              [(ngModel)]="settings.theme" 
              class="setting-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label for="language">Language:</label>
            <select 
              id="language"
              [(ngModel)]="settings.language" 
              class="setting-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h2>Notifications</h2>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications">
              <span class="checkmark"></span>
              Enable weather notifications
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.severeWeatherAlerts">
              <span class="checkmark"></span>
              Severe weather alerts
            </label>
          </div>
        </div>
        
        <div class="settings-actions">
          <button (click)="saveSettings()" class="save-btn">
            💾 Save Settings
          </button>
          <button (click)="resetSettings()" class="reset-btn">
            🔄 Reset to Default
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .settings-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .settings-header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }
    
    .settings-header p {
      font-size: 1.1rem;
      color: #7f8c8d;
      margin: 0;
    }
    
    .settings-content {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .settings-section {
      margin-bottom: 2.5rem;
    }
    
    .settings-section h2 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #ecf0f1;
    }
    
    .setting-item {
      margin-bottom: 1.5rem;
    }
    
    .setting-item label {
      display: block;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .setting-input, .setting-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    
    .setting-input:focus, .setting-select:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .checkbox-label {
      display: flex !important;
      align-items: center;
      cursor: pointer;
      font-weight: 500;
    }
    
    .checkbox-label input[type="checkbox"] {
      margin-right: 0.75rem;
      width: auto;
    }
    
    .settings-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #ecf0f1;
    }
    
    .save-btn, .reset-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .save-btn {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    }
    
    .save-btn:hover {
      background: linear-gradient(135deg, #2ecc71, #27ae60);
      transform: translateY(-2px);
    }
    
    .reset-btn {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
    }
    
    .reset-btn:hover {
      background: linear-gradient(135deg, #c0392b, #e74c3c);
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }
      
      .settings-header h1 {
        font-size: 2rem;
      }
      
      .settings-content {
        padding: 1.5rem;
      }
      
      .settings-actions {
        flex-direction: column;
      }
      
      .save-btn, .reset-btn {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings = {
    defaultCity: 'London',
    temperatureUnit: 'celsius',
    windUnit: 'kmh',
    theme: 'light',
    language: 'en',
    notifications: true,
    severeWeatherAlerts: true
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('weatherSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    localStorage.setItem('weatherSettings', JSON.stringify(this.settings));
    alert('Settings saved successfully!');
  }

  resetSettings() {
    this.settings = {
      defaultCity: 'London',
      temperatureUnit: 'celsius',
      windUnit: 'kmh',
      theme: 'light',
      language: 'en',
      notifications: true,
      severeWeatherAlerts: true
    };
    localStorage.removeItem('weatherSettings');
    alert('Settings reset to default!');
  }
}
