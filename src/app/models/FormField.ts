import { FormControl } from '@angular/forms';

export class FormField {
    dataType!: string;
    title!: string;
    dropDownOptions?: Array<{ value: string, label: string }>; // For dropdowns and radio buttons
    formControl!: FormControl;
}
