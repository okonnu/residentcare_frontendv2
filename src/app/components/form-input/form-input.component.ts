import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ThemePalette } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { provideNativeDateAdapter } from '@angular/material/core';

// Interface for select and radio options
export interface FormInputOption {
  value: any;
  label: string;
  disabled?: boolean;
}


@Component({
  standalone: true,
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  imports: [
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    provideNgxMask(),
    provideNativeDateAdapter()
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() formControl!: FormControl;
  @Input() required: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};

  // Enhanced inputs for different field types
  @Input() options: FormInputOption[] = []; // For select and radio inputs
  @Input() mask: string = ''; // For masked inputs like SSN, phone
  @Input() showMaskTyped: boolean = false; // Whether to show mask while typing
  @Input() radioButtonClass: string = 'radio-button'; // CSS class for radio buttons
  @Input() radioGroupClass: string = 'radio-group'; // CSS class for radio group
  @Input() multiple: boolean = false; // For multiple select

  // ControlValueAccessor implementation
  private _value: any;
  onChange: any = () => { };
  onTouched: any = () => { };

  // Default error messages
  private defaultErrorMessages: { [key: string]: string } = {
    required: 'This field is required',
    email: 'Invalid email format',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
    min: 'Value is below the minimum',
    max: 'Value exceeds the maximum',
    pattern: 'Invalid format'
  };

  // Required by ControlValueAccessor
  writeValue(value: any): void {
    this._value = value;
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  // Helper methods
  getErrorKeys(errors: any): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getDefaultMessage(errorKey: string): string {
    return this.errorMessages[errorKey] ||
      this.defaultErrorMessages[errorKey] ||
      `Validation failed (${errorKey})`;
  }

  // Handle input changes
  onInputChange(value: any): void {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  // Helper methods for template
  get isTextInput(): boolean {
    return ['text', 'number', 'email', 'tel', 'password', 'url'].includes(this.type);
  }

  get isDateInput(): boolean {
    return this.type === 'date';
  }

  get isTimeInput(): boolean {
    return this.type === 'time';
  }

  get isSelectInput(): boolean {
    return this.type === 'select';
  }

  get isRadioInput(): boolean {
    return this.type === 'radio';
  }

  get isSSNInput(): boolean {
    return this.type === 'ssn';
  }

  get effectiveMask(): string {
    if (this.type === 'ssn' && !this.mask) {
      return '000-00-0000';
    }
    return this.mask;
  }

  get effectivePlaceholder(): string {
    if (this.type === 'ssn' && !this.placeholder) {
      return '___-__-____';
    }
    return this.placeholder;
  }
}