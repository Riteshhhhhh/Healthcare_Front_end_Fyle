import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './main';
import { WorkoutService } from './workout.service';
import { FormsModule } from '@angular/forms';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [],
      providers: [WorkoutService]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form correctly', () => {
    // Initially form should be invalid
    expect(component.isFormValid()).toBeFalse();

    // Set valid form values
    component.entry = {
      userName: 'John',
      workoutType: 'Running',
      minutes: 30
    };

    expect(component.isFormValid()).toBeTrue();

    // Test invalid cases
    component.entry = {
      userName: '',  // Empty username
      workoutType: 'Running',
      minutes: 30
    };
    expect(component.isFormValid()).toBeFalse();

    component.entry = {
      userName: 'John',
      workoutType: '',  // Empty workout type
      minutes: 30
    };
    expect(component.isFormValid()).toBeFalse();

    component.entry = {
      userName: 'John',
      workoutType: 'Running',
      minutes: 0  // Invalid minutes
    };
    expect(component.isFormValid()).toBeFalse();
  });

  it('should add workout and update summaries', () => {
    const testEntry = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };

    component.entry = testEntry;
    component.onSubmit();

    // Check if entry was added
    const entries = workoutService.getEntries();
    expect(entries).toContain(jasmine.objectContaining(testEntry));

    // Check if summaries were updated
    const summaries = component.summaries;
    const userSummary = summaries.find(s => s.name === 'Test User');
    expect(userSummary).toBeTruthy();
    expect(userSummary?.numberOfWorkouts).toBe(1);
    expect(userSummary?.totalMinutes).toBe(30);
  });

  it('should filter summaries correctly', () => {
    // Add test data
    component.entry = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };
    component.onSubmit();

    // Test search filter
    component.searchTerm = 'Test';
    component.applyFilters();
    expect(component.filteredSummaries.length).toBe(1);
    expect(component.filteredSummaries[0].name).toBe('Test User');

    // Test workout type filter
    component.selectedWorkoutType = 'Running';
    component.applyFilters();
    expect(component.filteredSummaries.length).toBe(1);

    // Test no matches
    component.searchTerm = 'NonExistent';
    component.applyFilters();
    expect(component.filteredSummaries.length).toBe(0);
  });
});