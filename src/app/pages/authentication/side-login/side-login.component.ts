import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Login } from "../../../models/auth.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../components/form-input/form-input.component";
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

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
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['example@email.com', [Validators.required, Validators.email]],
      password: ['xxxxxxxxxxx', [Validators.required]],
    });
  }

  onLoginFormSubmitted() {
    if (!this.loginForm.valid) {
      // Mark all form controls as touched to trigger validation displays
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
        control?.markAsDirty();
      });
      return;
    }
    this.authService.login(this.loginForm.value as Login).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
  
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (!field || !field.errors) return '';
    
    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    
    return 'Invalid input';
  }
}
