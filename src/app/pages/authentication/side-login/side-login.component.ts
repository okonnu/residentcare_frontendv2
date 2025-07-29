import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Login } from "../../../models/auth.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../components/form-input/form-input.component";
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { SnackBarService } from 'src/app/services/snackBar.service';

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
  private snackBarService: SnackBarService = inject(SnackBarService);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['admin2@gmail.com', [Validators.required, Validators.email]],
      password: ['Qwerty54321', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLoginFormSubmitted() {
    if (this.loginForm.invalid) {
      this.snackBarService.showError('Please fill in all required fields correctly.');
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
