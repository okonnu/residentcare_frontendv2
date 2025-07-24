// Enhanced form-input component usage examples

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InputComponent, FormInputOption } from './form-input.component';

@Component({
    selector: 'app-enhanced-form-input-examples',
    template: `
    <div class="container-fluid p-4">
      <h2>Enhanced Form-Input Component Examples</h2>
      
      <form [formGroup]="exampleForm" class="mt-4">
        
        <!-- Text Input Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Text Input with Validation</h4>
            <form-input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              [formControl]="getFormControl('fullName')"
              [required]="true">
            </form-input>
          </div>
        </div>

        <!-- Email Input Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Email Input with Built-in Validation</h4>
            <form-input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              [formControl]="getFormControl('email')"
              [required]="true">
            </form-input>
          </div>
        </div>

        <!-- SSN Input Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>SSN Input with Automatic Masking</h4>
            <form-input
              type="ssn"
              label="Social Security Number"
              [formControl]="getFormControl('ssn')"
              [required]="false"
              [showMaskTyped]="true">
            </form-input>
          </div>
        </div>

        <!-- Select Dropdown Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Select Dropdown</h4>
            <form-input
              type="select"
              label="Department"
              placeholder="Choose your department"
              [formControl]="getFormControl('department')"
              [required]="true"
              [options]="departmentOptions">
            </form-input>
          </div>
        </div>

        <!-- Multi-Select Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Multi-Select Dropdown</h4>
            <form-input
              type="select"
              label="Skills"
              placeholder="Select your skills"
              [formControl]="getFormControl('skills')"
              [required]="false"
              [multiple]="true"
              [options]="skillOptions">
            </form-input>
          </div>
        </div>

        <!-- Radio Button Example -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Radio Button Group</h4>
            <form-input
              type="radio"
              label="Employment Status"
              [formControl]="getFormControl('status')"
              [required]="true"
              [options]="statusOptions">
            </form-input>
          </div>
        </div>

        <!-- Phone Number with Custom Mask -->
        <div class="row mb-3">
          <div class="col-12">
            <h4>Phone Number with Custom Mask</h4>
            <form-input
              type="text"
              label="Phone Number"
              placeholder="(000) 000-0000"
              [formControl]="getFormControl('phone')"
              [required]="false"
              [mask]="'(000) 000-0000'"
              [showMaskTyped]="true">
            </form-input>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="row mt-4">
          <div class="col-12">
            <button type="button" mat-raised-button color="primary" 
                    (click)="onSubmit()" [disabled]="exampleForm.invalid">
              Submit Form
            </button>
            <button type="button" mat-raised-button color="warn" 
                    (click)="resetForm()" class="ms-2">
              Reset
            </button>
          </div>
        </div>

        <!-- Form Status Display -->
        <div class="row mt-4">
          <div class="col-12">
            <mat-card class="p-3">
              <h5>Form Status:</h5>
              <p><strong>Valid:</strong> {{ exampleForm.valid }}</p>
              <p><strong>Form Value:</strong></p>
              <pre>{{ getFormValueJSON() }}</pre>
            </mat-card>
          </div>
        </div>

      </form>
    </div>
  `,
    standalone: true,
    imports: [InputComponent, /* other imports */]
})
export class EnhancedFormInputExamplesComponent {
    exampleForm: FormGroup;

    // Option arrays for different input types
    departmentOptions: FormInputOption[] = [
        { value: 'IT', label: 'Information Technology' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'Finance', label: 'Finance & Accounting' },
        { value: 'Marketing', label: 'Marketing & Sales' },
        { value: 'Operations', label: 'Operations', disabled: false }
    ];

    skillOptions: FormInputOption[] = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'angular', label: 'Angular' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'nodejs', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' }
    ];

    statusOptions: FormInputOption[] = [
        { value: 'active', label: 'Active Employee' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'contractor', label: 'Contractor' },
        { value: 'intern', label: 'Intern' }
    ];

    constructor(private formBuilder: FormBuilder) {
        this.exampleForm = this.formBuilder.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            ssn: [''],
            department: ['', Validators.required],
            skills: [[]],
            status: ['', Validators.required],
            phone: ['']
        });
    }

    getFormControl(field: string): FormControl {
        return this.exampleForm.get(field) as FormControl;
    }

    onSubmit(): void {
        if (this.exampleForm.valid) {
            console.log('Form submitted with values:', this.exampleForm.value);
            alert('Form submitted successfully! Check console for values.');
        } else {
            console.log('Form is invalid');
            this.markFormGroupTouched();
        }
    }

    resetForm(): void {
        this.exampleForm.reset();
        console.log('Form reset');
    }

    getFormValueJSON(): string {
        return JSON.stringify(this.exampleForm.value, null, 2);
    }

    private markFormGroupTouched(): void {
        Object.keys(this.exampleForm.controls).forEach(field => {
            const control = this.exampleForm.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
    }
}

/*
Enhanced Form-Input Component Features:

1. STANDARD INPUTS:
   - text, number, date, email, tel, password, url
   - Built-in validation for email type
   - Custom placeholder and label support

2. MASKED INPUTS:
   - SSN with automatic 000-00-0000 format
   - Custom masks for phone numbers, dates, etc.
   - Optional showMaskTyped for better UX

3. SELECT DROPDOWNS:
   - Single select with options array
   - Multi-select capability
   - Option disabled state support
   - Custom placeholder text

4. RADIO BUTTON GROUPS:
   - Option array with value/label pairs
   - Custom CSS classes for styling
   - Built-in validation support

5. CONSISTENT ERROR HANDLING:
   - Automatic error message display
   - Custom error messages via errorMessages input
   - Visual error indicators for all input types

6. ACCESSIBILITY:
   - Proper ARIA labels
   - Form control integration
   - Disabled state support

Usage Examples:

// Simple text input with validation
<form-input
  type="text"
  label="Name"
  [formControl]="nameControl"
  [required]="true">
</form-input>

// Select with options
<form-input
  type="select"
  label="Category"
  [formControl]="categoryControl"
  [options]="categoryOptions"
  [required]="true">
</form-input>

// Radio buttons
<form-input
  type="radio"
  label="Status"
  [formControl]="statusControl"
  [options]="statusOptions"
  [required]="true">
</form-input>

// SSN with automatic masking
<form-input
  type="ssn"
  label="SSN"
  [formControl]="ssnControl">
</form-input>
*/
