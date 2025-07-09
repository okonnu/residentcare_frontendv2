import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.production';
import { RestResponse, LoginSuccess } from '../models/auth.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchResidentServicesService {
  // Signal to hold search results
  searchResults! : any[]
  // Signal to track loading state
  isLoading = signal<boolean>(false);
  private CONTEXT = {};

  constructor(private http: HttpClient, private router: Router) {}

  searchResident(query: string): void {
    console.log("searching ........")
    this.isLoading.set(true); // Set loading to true
    this.http.get<any[]>(`${environment.apiUrl}/resident/search/${query}`)
      .pipe(
        tap(data => {
          console.log("search complete .....")
          console.log(data)
          this.searchResults = data ; // Update search results signal
          this.isLoading.set(false); // Set loading to false on success
        }),
        catchError(error => {
          console.error('Error during search:', error);
          this.searchResults = [] // Clear results on error
          this.isLoading.set(false); // Set loading to false on error
          return of([]); // Return an empty observable to prevent the error from propagating
        })
      )
      .subscribe(); // Subscribe to initiate the HTTP request
  }
  
}