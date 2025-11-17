import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, interval, of, Subscription, timeout } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-test';
  
  weight = '-';
  tray1 = '-';
  tray2 = '-';
  tray3 = '-';
  tray4 = '-';
  
  isLoading = false;
  connectionStatus: 'connected' | 'error' = 'error';
  lastUpdated: Date | null = null;
  
  private updateSubscription?: Subscription;
  private readonly API_BASE = 'http://localhost:5000'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
    // Update every second
    this.updateSubscription = interval(1000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private fmt1(value: any): string {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(1) : '-';
  }

  private fetchData() {
    this.isLoading = true;
    
    this.http.get<any>(`${this.API_BASE}/data`)
      .pipe(
        timeout(3000),
        catchError(error => {
          console.error('Fetch error:', error);
          this.connectionStatus = 'error';
          return of(null);
        })
      )
      .subscribe(data => {
        this.isLoading = false;
        
        if (data) {
          this.weight = this.fmt1(data.weight);
          this.tray1 = this.fmt1(data.tray1);
          this.tray2 = this.fmt1(data.tray2);
          this.tray3 = this.fmt1(data.tray3);
          this.tray4 = this.fmt1(data.tray4);
          
          this.connectionStatus = 'connected';
          this.lastUpdated = new Date();
        } else {
          this.connectionStatus = 'error';
        }
      });
  }
}