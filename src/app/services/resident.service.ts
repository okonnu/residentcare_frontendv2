import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.production';
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
  resident = signal<any>({});

  constructor(private http: HttpClient, private router: Router) {}

  searchResident(query: string): void {
    console.log("searching ........")
    this.isLoading.set(true); // Set loading to true
    
    // Create request body with the search query
    const requestBody = {
      searchString: query
    };
    
    this.http.post<any[]>(`${environment.apiUrl}/resident/search`, requestBody)
      .pipe(
        tap(response => {
          console.log("search complete .....")
          console.log(response)
          this.searchResults = response || []; // Extract data from RestResponse
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

  getResidentDetails(residentId: string): void {
    this.isLoading.set(true); // Set loading to true

    const requestBody = {
      id: residentId
    };

    this.http.post<any>(`${environment.apiUrl}/resident/getResidentById`, requestBody)
      .pipe(
        tap(response => {
          console.log("Resident details fetched successfully");
          this.resident.set(response); // Update resident signal with the fetched data
          this.isLoading.set(false); // Set loading to false on success
          this.router.navigate(['/pages/face-sheet']); // Navigate to resident details page
        }),
        catchError(error => {
          console.error('Error fetching resident details:', error);
          this.isLoading.set(false); // Set loading to false on error
          return of(null); // Return null on error
        })
      )
      .subscribe(); // Subscribe to initiate the HTTP request
  }

  saveResidentDetails(residentData: any): void {
    this.isLoading.set(true); // Set loading to true

    this.http.post<any>(`${environment.apiUrl}/resident`, residentData)
      .pipe(
        tap(response => {
          console.log("Resident details saved successfully");
          this.isLoading.set(false); // Set loading to false on success
          this.resident.set(response); // Update resident signal with the saved data
        }),
        catchError(error => {
          console.error('Error saving resident details:', error);
          this.isLoading.set(false); // Set loading to false on error
          return of(null); // Return null on error
        })
      )
      .subscribe(); // Subscribe to initiate the HTTP request
  }
  
}