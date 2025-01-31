import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { WorkoutService, WorkoutEntry, UserSummary } from './workout.service';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container">
      <div class="input-section">
        <div class="input-group">
          <label for="userName">User Name*</label>
          <input 
            type="text" 
            id="userName" 
            name="userName" 
            [(ngModel)]="entry.userName" 
            required
            class="form-control">
        </div>

        <div class="input-row">
          <div class="input-group">
            <label for="workoutType">Workout Type*</label>
            <select 
              id="workoutType" 
              name="workoutType" 
              [(ngModel)]="entry.workoutType" 
              required
              class="form-control">
              <option value="">Select a workout</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Swimming">Swimming</option>
              <option value="Weight Training">Weight Training</option>
              <option value="Yoga">Yoga</option>
            </select>
          </div>

          <div class="input-group">
            <label for="minutes">Workout Minutes*</label>
            <input 
              type="number" 
              id="minutes" 
              name="minutes" 
              [(ngModel)]="entry.minutes" 
              required
              min="1"
              class="form-control">
          </div>
        </div>

        <button class="add-workout-btn" (click)="onSubmit()" [disabled]="!isFormValid()">
          Add Workout
        </button>
      </div>

      <div class="summary-section">
        <div class="filters">
          <input 
            type="text" 
            placeholder="Search" 
            class="search-input"
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()">
          
          <select 
            class="filter-select"
            [(ngModel)]="selectedWorkoutType"
            (ngModelChange)="applyFilters()">
            <option value="">Filter by Workout Type</option>
            <option value="All">All</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Swimming">Swimming</option>
            <option value="Weight Training">Weight Training</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        <table class="workout-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Workouts</th>
              <th>Number of Workouts</th>
              <th>Total Workout Minutes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let summary of filteredSummaries">
              <td>{{ summary.name }}</td>
              <td>{{ summary.workouts }}</td>
              <td>{{ summary.numberOfWorkouts }}</td>
              <td>{{ summary.totalMinutes }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="chart-section">
        <h2>Workout Progress</h2>
        <div class="chart-container">
          <div class="user-list">
            <div 
              *ngFor="let user of getUserList()" 
              [class.active]="selectedUser === user"
              (click)="selectUser(user)"
              class="user-item">
              {{ user }}
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas #chartCanvas></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .input-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .input-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .input-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background: white;
    }

    .add-workout-btn {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .add-workout-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background: #f8f9fa;
    }

    .search-input {
      flex: 1;
    }

    .workout-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .workout-table th,
    .workout-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .workout-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .chart-section {
      margin-top: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .chart-container {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }

    .user-list {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }

    .user-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .user-item:hover {
      background: #e9ecef;
    }

    .user-item.active {
      background: #007bff;
      color: white;
    }

    .chart-wrapper {
      width: 100%;
      height: 400px;
    }
  `]
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  entry: WorkoutEntry = {
    userName: '',
    workoutType: '',
    minutes: 0
  };

  summaries: UserSummary[] = [];
  filteredSummaries: UserSummary[] = [];
  searchTerm: string = '';
  selectedWorkoutType: string = '';
  selectedUser: string = '';
  chart: Chart | null = null;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    // Add some sample data
    const sampleData = [
      { userName: 'John Doe', workoutType: 'Running', minutes: 30 },
      { userName: 'John Doe', workoutType: 'Cycling', minutes: 45 },
      { userName: 'Jane Smith', workoutType: 'Swimming', minutes: 40 },
      { userName: 'Jane Smith', workoutType: 'Running', minutes: 40 },
      { userName: 'Mike Johnson', workoutType: 'Yoga', minutes: 45 },
      { userName: 'Mike Johnson', workoutType: 'Cycling', minutes: 45 }
    ];

    sampleData.forEach(data => this.workoutService.addWorkout(data));
    this.updateSummaries();
    this.applyFilters();
  }

  ngAfterViewInit() {
    const users = this.getUserList();
    if (users.length > 0) {
      this.selectUser(users[0]);
    }
  }

  isFormValid(): boolean {
    return this.entry.userName.trim() !== '' && 
           this.entry.workoutType !== '' && 
           this.entry.minutes > 0;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.workoutService.addWorkout(this.entry);
      this.updateSummaries();
      this.applyFilters();
      this.selectUser(this.entry.userName);
      
      // Reset form
      this.entry = {
        userName: '',
        workoutType: '',
        minutes: 0
      };
    }
  }

  updateSummaries() {
    this.summaries = this.workoutService.getSummaries();
  }

  applyFilters() {
    this.filteredSummaries = this.summaries.filter(summary => {
      const matchesSearch = summary.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.selectedWorkoutType || 
                         this.selectedWorkoutType === 'All' ||
                         summary.workouts.includes(this.selectedWorkoutType);
      return matchesSearch && matchesType;
    });
  }

  getUserList(): string[] {
    return [...new Set(this.workoutService.getEntries().map(entry => entry.userName))];
  }

  selectUser(userName: string) {
    this.selectedUser = userName;
    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const userWorkouts = this.workoutService.getUserWorkoutData(this.selectedUser);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(userWorkouts),
        datasets: [{
          label: 'Minutes',
          data: Object.values(userWorkouts),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${this.selectedUser}'s workout progress`
          }
        }
      }
    });
  }
}

bootstrapApplication(App);