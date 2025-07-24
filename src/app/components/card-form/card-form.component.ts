import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { InputComponent } from '../form-input/form-input.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Structure {
  title: string;
  value: any;
  dataType: string; // 'text', 'number', 'date', 'email', 'tel', 'select', 'radio', 'ssn', etc.
  color?: string; // Optional for display purposes
  icon?: string;  // Optional for display purposes
  options?: Array<{ value: string, label: string }>; // For dropdowns and radio buttons
  required?: boolean; // Whether field is required
  validators?: any[]; // Custom validators for the field
  disabled?: boolean; // Whether field is disabled
}

@Component({
  selector: 'card-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule,
    NgxMaskDirective,
    InputComponent
  ],
  templateUrl: './card-form.component.html',
  providers: [
    provideNgxMask()
  ]
})
export class CardFormComponent implements OnInit {
  @Input() dataSet: Structure[] = [];
  @Input() title: string = '';
  @Input() image: string | null = null;
  @Input() editMode: boolean = false;
  @Input() showEditButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() editButtonText: string = 'Edit';
  @Input() saveButtonText: string = 'Save';
  @Input() cancelButtonText: string = 'Cancel';

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  cardForm!: FormGroup;
  originalData: any = {};

  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    // Store original data for cancel functionality
    this.storeOriginalData();

    // Create form if starting in edit mode
    if (this.editMode) {
      this.createForm();
    }
  }

  trackByTitle(index: number, item: Structure): string {
    return item.title;
  }

  toggleEditMode() {
    if (!this.editMode) {
      // Entering edit mode
      this.createForm();
      this.editMode = true;
      this.edit.emit();
    } else {
      // Exiting edit mode (cancel)
      this.cancelEdit();
    }
  }

  saveChanges() {
    if (!this.cardForm) {
      this.showError('Form not initialized');
      return;
    }

    if (this.cardForm.invalid) {
      this.showError('Please fix form errors before saving');
      this.markFormGroupTouched(this.cardForm);
      return;
    }

    // Get form values and update dataSet
    const formValues = this.cardForm.value;
    this.updateDataSetWithFormValues(formValues);

    // Emit save event with updated data
    const updatedData = this.getDataAsObject();
    this.save.emit(updatedData);

    // Exit edit mode
    this.editMode = false;
    this.showSuccess('Changes saved successfully');
  }

  cancelEdit() {
    // Restore original data
    this.restoreOriginalData();
    this.editMode = false;
    this.cancel.emit();
  }

  // Helper method to create reactive form based on dataSet
  private createForm(): void {
    const formControls: { [key: string]: FormControl } = {};

    this.dataSet.forEach(item => {
      const validators = [];

      // Add required validator if specified
      if (item.required) {
        validators.push(Validators.required);
      }

      // Add email validator for email fields
      if (item.dataType === 'email') {
        validators.push(Validators.email);
      }

      // Add custom validators if specified
      if (item.validators && item.validators.length > 0) {
        validators.push(...item.validators);
      }

      // Create form control with current value and validators
      formControls[item.title] = new FormControl({
        value: item.value,
        disabled: item.disabled || false
      }, validators);
    });

    this.cardForm = this.formBuilder.group(formControls);
  }

  // Get form control for template
  getFormControl(fieldTitle: string): FormControl {
    return this.cardForm?.get(fieldTitle) as FormControl;
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Store original data for cancel functionality
  private storeOriginalData(): void {
    this.originalData = {};
    this.dataSet.forEach(item => {
      this.originalData[item.title] = item.value;
    });
  }

  // Restore original data on cancel
  private restoreOriginalData(): void {
    this.dataSet.forEach(item => {
      if (this.originalData.hasOwnProperty(item.title)) {
        item.value = this.originalData[item.title];
      }
    });
  }

  // Update dataSet with form values
  private updateDataSetWithFormValues(formValues: any): void {
    this.dataSet.forEach(item => {
      if (formValues.hasOwnProperty(item.title)) {
        item.value = formValues[item.title];
      }
    });
  }

  // Convert dataSet to object for emitting
  private getDataAsObject(): any {
    const result: any = {};
    this.dataSet.forEach(item => {
      result[item.title] = item.value;
    });
    return result;
  }

  // Utility methods for notifications
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}