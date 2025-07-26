import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { CardFormComponent } from '../../components/card-form-v2/card-form.component';
import { FormField } from 'src/app/models/FormField';
import { Builder } from 'builder-pattern';

@Component({
    selector: 'card-form-example',
    standalone: true,
    imports: [CommonModule, CardFormComponent],
    templateUrl: './card-form-example.component.html',
    styleUrl: './card-form-example.component.scss'
})


export class CardFormExampleComponent {

    firstName = Builder(FormField)
        .dataType('text')
        .title('First Name')
        .formControl(new FormControl('John', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
        .build();


    // Sample resident data with comprehensive validation examples
    residentData = [
        Builder(FormField)
            .dataType('text')
            .title('First Name')
            .formControl(new FormControl('John', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
            .build(),
        Builder(FormField)
            .dataType('text')
            .title('Last Name')
            .formControl(new FormControl('Doe', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
            .build(),
        Builder(FormField)
            .title('Email')
            .formControl(new FormControl('john.doe@example.com', [Validators.required, Validators.email]))
            .build(),
        Builder(FormField)
            .dataType('tel')
            .title('Phone')
            .formControl(new FormControl('555-123-4567', [Validators.required]))
            .build(),
        Builder(FormField)
            .dataType('date')
            .title('Date of Birth')
            .formControl(new FormControl('1985-03-15', [Validators.required]))
            .build(),
        Builder(FormField)
            .dataType('number')
            .title('Age')
            .formControl(new FormControl(38, [Validators.min(18), Validators.max(120)]))
            .build(),
        Builder(FormField)
            .dataType('ssn')
            .title('SSN')
            .formControl(new FormControl('123-45-6789', [Validators.required]))
            .build(),
        Builder(FormField)
            .dataType('select')
            .title('Gender')
            .formControl(new FormControl('male', [Validators.required]))
            .dropDownOptions([
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' }
            ])
            .build(),
        Builder(FormField)
            .dataType('radio')
            .title('Marital Status')
            .formControl(new FormControl('single'))
            .dropDownOptions([
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'divorced', label: 'Divorced' },
                { value: 'widowed', label: 'Widowed' }
            ])
            .build(),
        Builder(FormField)
            .dataType('text')
            .title('Emergency Contact')
            .formControl(new FormControl('Jane Doe', [Validators.required, Validators.minLength(2)]))
            .build()
    ];


    // Event handlers for card form actions
    onResidentSave(data: any) {
        console.log('Resident data saved:', data);
        // Handle save logic here
    }

    onResidentCancel() {
        console.log('Resident edit cancelled');
        // Handle cancel logic here
    }

    onInsuranceSave(data: any) {
        console.log('Insurance data saved:', data);
        // Handle save logic here
    }

    onInsuranceCancel() {
        console.log('Insurance edit cancelled');
        // Handle cancel logic here
    }

    onMedicalSave(data: any) {
        console.log('Medical data saved:', data);
        // Handle save logic here
    }

    onMedicalCancel() {
        console.log('Medical edit cancelled');
        // Handle cancel logic here
    }
}




