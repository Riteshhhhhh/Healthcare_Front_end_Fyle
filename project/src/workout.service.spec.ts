import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add workouts correctly', () => {
    const workout = {
      userName: 'John',
      workoutType: 'Running',
      minutes: 30
    };

    service.addWorkout(workout);
    const entries = service.getEntries();

    expect(entries.length).toBe(1);
    expect(entries[0]).toEqual(workout);
  });

  it('should calculate user summaries correctly', () => {
    // Add multiple workouts for the same user
    service.addWorkout({
      userName: 'John',
      workoutType: 'Running',
      minutes: 30
    });

    service.addWorkout({
      userName: 'John',
      workoutType: 'Cycling',
      minutes: 45
    });

    const summaries = service.getSummaries();
    expect(summaries.length).toBe(1);

    const johnSummary = summaries[0];
    expect(johnSummary.name).toBe('John');
    expect(johnSummary.numberOfWorkouts).toBe(2);
    expect(johnSummary.totalMinutes).toBe(75);
    expect(johnSummary.workouts).toContain('Running');
    expect(johnSummary.workouts).toContain('Cycling');
  });

  it('should get user workout data correctly', () => {
    // Add multiple workouts for the same user
    service.addWorkout({
      userName: 'John',
      workoutType: 'Running',
      minutes: 30
    });

    service.addWorkout({
      userName: 'John',
      workoutType: 'Running',
      minutes: 20
    });

    service.addWorkout({
      userName: 'John',
      workoutType: 'Cycling',
      minutes: 45
    });

    const workoutData = service.getUserWorkoutData('John');
    expect(workoutData['Running']).toBe(50); // 30 + 20
    expect(workoutData['Cycling']).toBe(45);
  });

  it('should handle multiple users correctly', () => {
    service.addWorkout({
      userName: 'John',
      workoutType: 'Running',
      minutes: 30
    });

    service.addWorkout({
      userName: 'Jane',
      workoutType: 'Cycling',
      minutes: 45
    });

    const summaries = service.getSummaries();
    expect(summaries.length).toBe(2);

    const johnSummary = summaries.find(s => s.name === 'John');
    const janeSummary = summaries.find(s => s.name === 'Jane');

    expect(johnSummary?.numberOfWorkouts).toBe(1);
    expect(johnSummary?.totalMinutes).toBe(30);
    expect(janeSummary?.numberOfWorkouts).toBe(1);
    expect(janeSummary?.totalMinutes).toBe(45);
  });
});