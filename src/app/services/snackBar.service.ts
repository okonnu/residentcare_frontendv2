
import { MatSnackBar } from '@angular/material/snack-bar';

import { Injectable, inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SnackBarService {
    private snackBar = inject(MatSnackBar);

    showSuccess(message: string): void {
        this.snackBar.open(message, '', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }

    showError(message: string): void {
        this.snackBar.open(message, '', {
            duration: 4000,
            panelClass: ['error-snackbar']
        });
    }
}