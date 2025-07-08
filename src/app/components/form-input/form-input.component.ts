import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ThemePalette } from '@angular/material/core';


@Component({
  standalone: true,
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  imports: [MatFormFieldModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input()
  label: string = '';
  @Input()
  type: string = 'text';
  @Input()
  placeholder: string = '';
  @Input()
  appearance: MatFormFieldAppearance = 'outline';
  @Input()
  color: ThemePalette = 'primary';
  @Input()
  formControl!: FormControl;
  @Input()
  required: boolean = false;
  @Input()
  errorMessages: { [key: string]: string } = {};

  // ControlValueAccessor implementation
  private _value: any;
  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  // Default error messages
  private defaultErrorMessages: { [key: string]: string } = {
    required: 'This field is required',
    email: 'Invalid email format',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
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
    this.disabled = isDisabled;
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
}