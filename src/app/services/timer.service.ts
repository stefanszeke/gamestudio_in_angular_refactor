import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';

export interface TimerData {
  display: string;
  milliseconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer$ = new Subject<TimerData>();
  private intervalId: any = null;
  private startTime: number = 0;

  constructor() { }

  startTimer(): void {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      this.updateTimer(elapsed);
    }, 10);
  }

  pauseTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTimer(): Observable<TimerData> {
    return this.timer$.asObservable();
  }

  resetTimer(): void {
    this.pauseTimer();
    this.startTime = 0;
    this.updateTimer(0);
  }

  private updateTimer(elapsed: number) {
    let minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
    let seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    let milliseconds = (elapsed % 1000).toString().padStart(3, '0');

    this.timer$.next({
      display: `${minutes}m:${seconds}s.${milliseconds}ms`,
      milliseconds: elapsed,
    })
  }
}
