import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.production';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResidentService } from './resident.service';
import { Vital } from '../models/vital.interface';

@Injectable({ providedIn: "root" })

export class VitalService {
    // This service can be expanded with methods to handle vital signs data
    // For example, methods to fetch, create, update, or delete vital signs records
    // Currently, it is a placeholder for future implementation

    residentVitals = signal<any[]>([]);
    isLoading = signal<boolean>(false);
    private http = inject(HttpClient);
    private _snackBar = inject(MatSnackBar);
    private residentService = inject(ResidentService);
    private residentId = this.residentService.resident().id // Replace with actual resident ID

    getResidentVitals(): void {
        this.isLoading.set(true);
        this.http.get<any[]>(`${environment.apiUrl}/vital/resident/${this.residentId}`)
            .pipe(
                tap(response => {
                    this.residentVitals.set(response);
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this._snackBar.open(error.message, '', {
                        duration: 4000,
                        panelClass: ['error-snackbar']
                    });
                    this.isLoading.set(false);
                    return of([]);
                })
            )
            .subscribe();
    }

    createResidentVital(vital: Vital): void {
        this.isLoading.set(true);
        vital.residentId = this.residentId; // Ensure the resident ID is set

        this.http.post<any>(`${environment.apiUrl}/vital/resident/${this.residentId}`, vital)
            .pipe(
                tap(response => {
                    this._snackBar.open('Vital record created successfully', '', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.getResidentVitals(); // Refresh the list after creation
                }),
                catchError(error => {
                    this._snackBar.open(`Error creating vital: ${error.message}`, '', {
                        duration: 4000,
                        panelClass: ['error-snackbar']
                    });
                    return of(null);
                })
            )
            .subscribe();
    }

    updateResidentVital(vital: Vital): void {
        this.isLoading.set(true);

        this.http.put<any>(`${environment.apiUrl}/vital/${vital.id}`, vital)
            .pipe(
                tap(response => {
                    this._snackBar.open('Vital record updated successfully', '', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.getResidentVitals(); // Refresh the list after update
                }),
                catchError(error => {
                    this._snackBar.open(`Error updating vital: ${error.message}`, '', {
                        duration: 4000,
                        panelClass: ['error-snackbar']
                    });
                    return of(null);
                })
            )
            .subscribe();
    }

    deleteResidentVital(vitalId: string): void {
        this.isLoading.set(true);

        this.http.delete<any>(`${environment.apiUrl}/vital/${vitalId}`)
            .pipe(
                tap(response => {
                    this._snackBar.open('Vital record deleted successfully', '', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.getResidentVitals(); // Refresh the list after deletion
                }),
                catchError(error => {
                    this._snackBar.open(`Error deleting vital: ${error.message}`, '', {
                        duration: 4000,
                        panelClass: ['error-snackbar']
                    });
                    return of(null);
                })
            )
            .subscribe();
    }

}