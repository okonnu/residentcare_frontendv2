import { FormControl } from '@angular/forms';

export class FormField {
    key!: string; // Explicit key for data mapping
    dataType!: string;
    title!: string;
    label!: string; // Added label property for better clarity
    dropDownOptions?: Array<{ value: string, label: string }>; // For dropdowns and radio buttons
    formControl!: FormControl;
}
