import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CardFormComponent } from '../../components/card-form/card-form.component';

@Component({
    selector: 'card-form-example',
    standalone: true,
    imports: [CommonModule, CardFormComponent],
    templateUrl: './card-form-example.component.html',
    styleUrl: './card-form-example.component.scss'
})
export class CardFormExampleComponent {

    // Custom validators for SSN format
    ssnValidator = [
        Validators.required,
        Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)
    ];

    // Custom validators for phone numbers
    phoneValidator = [
        Validators.required,
        Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ];

    // Custom validators for email
    emailValidator = [
        Validators.required,
        Validators.email
    ];

    // Sample resident data with comprehensive validation examples
    residentData = [
        {
            title: 'First Name',
            value: 'John',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
        },
        {
            title: 'Last Name',
            value: 'Doe',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
        },
        {
            title: 'Email',
            value: 'john.doe@example.com',
            dataType: 'email',
            required: true,
            validators: this.emailValidator
        },
        {
            title: 'Phone',
            value: '555-123-4567',
            dataType: 'tel',
            required: true,
            validators: this.phoneValidator
        },
        {
            title: 'Date of Birth',
            value: '1985-03-15',
            dataType: 'date',
            required: true,
            validators: [Validators.required]
        },
        {
            title: 'Age',
            value: 38,
            dataType: 'number',
            required: false,
            validators: [Validators.min(18), Validators.max(120)]
        },
        {
            title: 'SSN',
            value: '123-45-6789',
            dataType: 'ssn',
            required: true,
            validators: this.ssnValidator
        },
        {
            title: 'Gender',
            value: 'male',
            dataType: 'select',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' }
            ]
        },
        {
            title: 'Marital Status',
            value: 'single',
            dataType: 'radio',
            required: false,
            validators: [],
            options: [
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'divorced', label: 'Divorced' },
                { value: 'widowed', label: 'Widowed' }
            ]
        },
        {
            title: 'Emergency Contact',
            value: 'Jane Doe',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.minLength(2)]
        }
    ];

    // Insurance information card with enhanced validation
    insuranceData = [
        {
            title: 'Provider',
            value: 'Blue Cross Blue Shield',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.minLength(3)]
        },
        {
            title: 'Policy Number',
            value: 'BC123456789',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{8,15}$/)]
        },
        {
            title: 'Group Number',
            value: 'GRP001',
            dataType: 'text',
            required: false,
            validators: [Validators.pattern(/^[A-Z0-9]{3,10}$/)]
        },
        {
            title: 'Coverage Type',
            value: 'comprehensive',
            dataType: 'select',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 'basic', label: 'Basic' },
                { value: 'standard', label: 'Standard' },
                { value: 'comprehensive', label: 'Comprehensive' },
                { value: 'premium', label: 'Premium' }
            ]
        },
        {
            title: 'Primary Care Physician',
            value: 'Dr. Smith',
            dataType: 'text',
            required: false,
            validators: [Validators.minLength(2)]
        },
        {
            title: 'Effective Date',
            value: '2024-01-01',
            dataType: 'date',
            required: true,
            validators: [Validators.required]
        }
    ];

    // Medical history card with enhanced validation and custom fields
    medicalData = [
        {
            title: 'Blood Type',
            value: 'O+',
            dataType: 'select',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' }
            ]
        },
        {
            title: 'Height (inches)',
            value: 72,
            dataType: 'number',
            required: true,
            validators: [Validators.required, Validators.min(36), Validators.max(96)]
        },
        {
            title: 'Weight (lbs)',
            value: 180,
            dataType: 'number',
            required: true,
            validators: [Validators.required, Validators.min(50), Validators.max(500)]
        },
        {
            title: 'Medical Record Number',
            value: 'MRN-789123',
            dataType: 'text',
            required: true,
            validators: [Validators.required, Validators.pattern(/^MRN-\d{6}$/)]
        },
        {
            title: 'Allergies',
            value: 'none',
            dataType: 'radio',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 'none', label: 'No Known Allergies' },
                { value: 'food', label: 'Food Allergies' },
                { value: 'medication', label: 'Medication Allergies' },
                { value: 'environmental', label: 'Environmental Allergies' },
                { value: 'multiple', label: 'Multiple Allergies' }
            ]
        },
        {
            title: 'Last Physical Exam',
            value: '2024-01-15',
            dataType: 'date',
            required: false,
            validators: [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]
        },
        {
            title: 'Emergency Contact SSN',
            value: '987-65-4321',
            dataType: 'ssn',
            required: false,
            validators: [Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]
        }
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
