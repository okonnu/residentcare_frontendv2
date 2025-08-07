import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.production';
import { Router } from '@angular/router';
import { SnackBarService } from './snackBar.service';
import { RestResponse } from '../models/app.model';
import { Resident } from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private _snackBar = inject(SnackBarService);
  searchResults!: any[]
  isLoading = signal<boolean>(false);
  resident = signal<Resident | null>(null);

  searchResident(query: string): void {
    this.isLoading.set(true);

    const requestBody = {
      searchString: query
    };

    this.http.post<any[]>(`${environment.apiUrl}/resident/search`, requestBody)
      .pipe(
        tap(response => {
          this.searchResults = response || []; // Extract data from RestResponse
          this.isLoading.set(false); // Set loading to false on success
        }),
        catchError(error => {
        this._snackBar.showError(`Error searching resident: ${error.message}`);
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

    this.http.post<RestResponse>(`${environment.apiUrl}/resident/getResidentById`, requestBody)
      .pipe(
        tap(response => {
          this._snackBar.showSuccess(response.message || 'Resident fetched successfully');
          this.resident.set(response.data); // Update resident signal with the fetched data
          this.isLoading.set(false); // Set loading to false on success
        }),
        catchError(error => {
          this._snackBar.showError(`Error fetching resident details: ${error.message}`);
          this.isLoading.set(false); // Set loading to false on error
          return of(null); // Return null on error
        })
      )
      .subscribe(); // Subscribe to initiate the HTTP request
  }

  saveResidentDetails(residentData: Resident): void {
    this.isLoading.set(true); // Set loading to true

    this.http.post<RestResponse>(`${environment.apiUrl}/resident/`, residentData)
      .pipe(
        tap(response => {
          this._snackBar.showSuccess(response.message || 'Resident details saved successfully');
          this.isLoading.set(false); // Set loading to false on success
          this.resident.set(response.data); // Update resident signal with the saved data
        }),
        catchError(error => {
          this._snackBar.showError(`Error saving resident details: ${error.error.message}`);
          console.log (error);
          this.isLoading.set(false); // Set loading to false on error
          return of(null); // Return null on error
        })
      )
      .subscribe(); // Subscribe to initiate the HTTP request
  }

  residentFullName(): string {
    if (!this.resident()) {
      return 'No Resident Selected';
    }
    return `${this.resident()?.firstName || ''} ${this.resident()?.lastName || ''}`.trim();
  }

}