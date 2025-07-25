import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.production';
import { catchError, of, tap } from 'rxjs';
import { ResidentService } from './resident.service';
import { Vitals } from '../models/vital.interface';
import { RestResponse } from '../models/app.interface';
import { SnackBarService } from './snackBar.service';

@Injectable({ providedIn: "root" })

export class VitalService {
    // This service can be expanded with methods to handle vital signs data
    // For example, methods to fetch, create, update, or delete vital signs records
    // Currently, it is a placeholder for future implementation

    residentVitals = signal<any[]>([]);
    isLoading = signal<boolean>(false);
    private http = inject(HttpClient);
    private _snackBar = inject(SnackBarService);
    private residentService = inject(ResidentService);

    get residentId(): string {
        return this.residentService.resident().id;
    }

    getResidentVitals(): void {
        if (!this.residentId) {
            this._snackBar.showError('Resident ID is not available');
            return;
        }
        this.isLoading.set(true);
        this.http.get<RestResponse>(`${environment.apiUrl}/vital/resident/${this.residentId}`)
            .pipe(
                tap(response => {
                    console.log('Fetched vitals:', response);
                    this.residentVitals.set(response?.data);
                    this.isLoading.set(false);
                    this._snackBar.showSuccess(response.message || 'Vitals fetched successfully');
                }),
                catchError(error => {
                    this._snackBar.showError(error.message);
                    this.isLoading.set(false);
                    return of([]);
                })
            )
            .subscribe();
    }

    createResidentVital(vital: Vitals): void {
        this.isLoading.set(true);
        vital.residentId = this.residentId; // Ensure the resident ID is set

        // Determine if this is an update (has ID) or create (no ID)
        const isUpdate = vital.id && vital.id.trim() !== '';
        const url = isUpdate
            ? `${environment.apiUrl}/vital/${vital.id}`
            : `${environment.apiUrl}/vital/resident/${this.residentId}`;

        // Remove audit fields as they are read-only
        const { audit, ...vitalData } = vital;

        const httpRequest = isUpdate
            ? this.http.put<RestResponse>(url, vitalData)
            : this.http.post<RestResponse>(url, vitalData);

        httpRequest
            .pipe(
                tap(response => {
                    const message = isUpdate
                        ? (response.message || 'Vital record updated successfully')
                        : (response.message || 'Vital record created successfully');
                    this._snackBar.showSuccess(message);
                    this.getResidentVitals(); // Refresh the list after operation
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    const action = isUpdate ? 'updating' : 'creating';
                    this._snackBar.showError(`Error ${action} vital: ${error.message}`);
                    this.isLoading.set(false);
                    return of(null);
                })
            )
            .subscribe();
    }

    updateResidentVital(vital: Vitals): void {
        this.isLoading.set(true);

        // Remove audit fields as they are read-only
        const { audit, ...vitalData } = vital;

        this.http.put<RestResponse>(`${environment.apiUrl}/vital/${vital.id}`, vitalData)
            .pipe(
                tap(response => {
                    this._snackBar.showSuccess(response.message || 'Vital record updated successfully');
                    this.getResidentVitals(); // Refresh the list after update
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this._snackBar.showError(`Error updating vital: ${error.message}`);
                    this.isLoading.set(false);
                    return of(null);
                })
            )
            .subscribe();
    }

    deleteResidentVital(vitalId: string): void {
        this.isLoading.set(true);

        this.http.delete<RestResponse>(`${environment.apiUrl}/vital/${vitalId}`)
            .pipe(
                tap(response => {
                    this._snackBar.showSuccess(response.message || 'Vital record deleted successfully');
                    this.getResidentVitals(); // Refresh the list after deletion
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this._snackBar.showError(`Error deleting vital: ${error.message}`);
                    this.isLoading.set(false);
                    return of(null);
                })
            )
            .subscribe();
    }


}