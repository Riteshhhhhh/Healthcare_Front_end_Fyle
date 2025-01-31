import { Injectable } from '@angular/core';

export interface WorkoutEntry {
  userName: string;
  workoutType: string;
  minutes: number;
}

export interface UserSummary {
  name: string;
  workouts: string;
  numberOfWorkouts: number;
  totalMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private entries: WorkoutEntry[] = [];

  addWorkout(entry: WorkoutEntry): void {
    this.entries.push({...entry});
  }

  getEntries(): WorkoutEntry[] {
    return [...this.entries];
  }

  getSummaries(): UserSummary[] {
    const userMap = new Map<string, UserSummary>();
    
    this.entries.forEach(entry => {
      if (!userMap.has(entry.userName)) {
        userMap.set(entry.userName, {
          name: entry.userName,
          workouts: entry.workoutType,
          numberOfWorkouts: 1,
          totalMinutes: entry.minutes
        });
      } else {
        const summary = userMap.get(entry.userName)!;
        summary.workouts = summary.workouts.includes(entry.workoutType) 
          ? summary.workouts 
          : `${summary.workouts}, ${entry.workoutType}`;
        summary.numberOfWorkouts++;
        summary.totalMinutes += entry.minutes;
      }
    });

    return Array.from(userMap.values());
  }

  getUserWorkoutData(userName: string): { [key: string]: number } {
    return this.entries
      .filter(entry => entry.userName === userName)
      .reduce((acc, entry) => {
        if (!acc[entry.workoutType]) {
          acc[entry.workoutType] = 0;
        }
        acc[entry.workoutType] += entry.minutes;
        return acc;
      }, {} as {[key: string]: number});
  }
}