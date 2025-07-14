import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Login } from "../../../models/auth.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../components/form-input/form-input.component";
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './side-login.component.html',
  styleUrl: './side-login.component.css'
})

export class AppSideLoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private _snackBar = inject(MatSnackBar);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['admin2@gmail.com', [Validators.required, Validators.email]],
      password: ['Qwerty54321', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLoginFormSubmitted() {
    if (this.loginForm.invalid) {
      this._snackBar.open('Something is not right, please check your entries', '', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.authService.login(this.loginForm.value as Login).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }


  getFormControl(field: string): FormControl {
    return this.loginForm.get(field) as FormControl;
  }
}
