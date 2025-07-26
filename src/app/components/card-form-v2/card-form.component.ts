import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { InputComponent } from '../form-input/form-input.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormField } from 'src/app/models/FormField';

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
  @Input() formControls: FormField[] = [];
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

  trackByTitle(index: number, item: FormField): string {
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

    // Emit save event with current data
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

  // Helper method to create reactive form based on formControls input
  private createForm(): void {
    const formControlsObj: { [key: string]: FormControl } = {};

    this.formControls.forEach(field => {
      if (field.formControl) {
        formControlsObj[field.title] = field.formControl;
      }
    });

    this.cardForm = this.formBuilder.group(formControlsObj);
  }

  // Get form control for template - directly access from formControls array
  getFormControl(fieldTitle: string): FormControl {
    const field = this.formControls.find(f => f.title === fieldTitle);
    if (!field?.formControl) {
      throw new Error(`FormControl not found for field: ${fieldTitle}`);
    }
    return field.formControl;
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
    this.formControls.forEach(field => {
      this.originalData[field.title] = field.formControl?.value;
    });
  }

  // Restore original data on cancel
  private restoreOriginalData(): void {
    this.formControls.forEach(field => {
      if (this.originalData.hasOwnProperty(field.title) && field.formControl) {
        field.formControl.setValue(this.originalData[field.title]);
      }
    });
  }

  // Convert formControls to object for emitting
  private getDataAsObject(): any {
    const result: any = {};
    this.formControls.forEach(field => {
      result[field.title] = field.formControl?.value;
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