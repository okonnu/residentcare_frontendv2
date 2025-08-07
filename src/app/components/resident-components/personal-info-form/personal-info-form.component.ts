import { Component, Input, Output, EventEmitter, computed, signal, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Resident } from "src/app/models/resident.model";
import { FormField } from 'src/app/models/FormField.model';
import { Builder } from 'builder-pattern';
import { CardFormComponent } from 'src/app/components/card-form/card-form.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'app-personal-info-form',
    standalone: true,
    imports: [CommonModule, CardFormComponent, MaterialModule],
    templateUrl: './personal-info-form.component.html',
    styleUrls: ['./personal-info-form.component.scss']
})
export class PersonalInfoFormComponent implements OnInit, OnChanges {
    @Input() resident: Resident | null = null;
    @Input() editMode: boolean = true;
    @Input() showEditButton: boolean = false;
    @Input() showCancelButton: boolean = true;
    @Input() saveButtonText: string = 'Save Personal Information';
    @Input() cancelButtonText: string = 'Cancel';

    @Output() save = new EventEmitter<Resident>();
    @Output() cancel = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    // Signal to hold the resident data
    private residentData = signal<Resident | null>(null);

    // Computed property for form fields
    personalInfoFields = computed(() => {
        const resident = this.resident || this.residentData();
        if (!resident) return [];

        return [
            Builder(FormField)
                .key('firstName')
                .dataType('text')
                .title('First Name')
                .label('First Name')
                .formControl(new FormControl(resident.firstName || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('lastName')
                .dataType('text')
                .title('Last Name')
                .label('Last Name')
                .formControl(new FormControl(resident.lastName || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('email')
                .dataType('email')
                .title('Email')
                .label('Email')
                .formControl(new FormControl(resident.email || '', [Validators.email]))
                .build(),
            Builder(FormField)
                .key('role')
                .dataType('text')
                .title('Role')
                .label('Role')
                .formControl(new FormControl(resident.role || 'ROLE_RESIDENT'))
                .hidden(true) // Hidden field as it's always ROLE_RESIDENT
                .build(),
            Builder(FormField)
                .key('sexAtBirth')
                .dataType('select')
                .title('Sex at Birth')
                .label('Sex at Birth')
                .formControl(new FormControl(resident.sexAtBirth || '', [Validators.required]))
                .dropDownOptions([
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                ])
                .build(),
            Builder(FormField)
                .key('dateOfBirth')
                .dataType('date')
                .title('Date of Birth')
                .label('Date of Birth')
                .formControl(new FormControl(
                    resident.dateOfBirth ?
                        new Date(resident.dateOfBirth).toISOString().split('T')[0] : '',
                    [Validators.required]
                ))
                .build(),
            Builder(FormField)
                .key('socialSecurityNumber')
                .dataType('ssn')
                .title('Social Security Number')
                .label('Social Security Number')
                .formControl(new FormControl(resident.socialSecurityNumber || '', []))
                .build(),
            Builder(FormField)
                .key('maritalStatus')
                .dataType('select')
                .title('Marital Status')
                .label('Marital Status')
                .formControl(new FormControl(resident.maritalStatus || ''))
                .dropDownOptions([
                    { value: 'Single', label: 'Single' },
                    { value: 'Married', label: 'Married' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Widowed', label: 'Widowed' },
                    { value: 'Separated', label: 'Separated' }
                ])
                .build(),
            Builder(FormField)
                .key('religion')
                .dataType('text')
                .title('Religion')
                .label('Religion')
                .formControl(new FormControl(resident.religion || ''))
                .build(),
            Builder(FormField)
                .key('primaryLanguage')
                .dataType('select')
                .title('Primary Language')
                .label('Primary Language')
                .formControl(new FormControl(resident.primaryLanguage || ''))
                .dropDownOptions([
                    { value: 'English', label: 'English' },
                    { value: 'Spanish', label: 'Spanish' },
                    { value: 'French', label: 'French' },
                    { value: 'German', label: 'German' },
                    { value: 'Italian', label: 'Italian' },
                    { value: 'Portuguese', label: 'Portuguese' },
                    { value: 'Chinese', label: 'Chinese' },
                    { value: 'Japanese', label: 'Japanese' },
                    { value: 'Korean', label: 'Korean' },
                    { value: 'Arabic', label: 'Arabic' },
                    { value: 'Russian', label: 'Russian' },
                    { value: 'Other', label: 'Other' }
                ])
                .build(),
            Builder(FormField)
                .key('ethnicity')
                .dataType('select')
                .title('Ethnicity')
                .label('Ethnicity')
                .formControl(new FormControl(resident.ethnicity || ''))
                .dropDownOptions([
                    { value: 'White', label: 'White' },
                    { value: 'Black or African American', label: 'Black or African American' },
                    { value: 'Asian', label: 'Asian' },
                    { value: 'Hispanic or Latino', label: 'Hispanic or Latino' },
                    { value: 'Native American', label: 'Native American' },
                    { value: 'Pacific Islander', label: 'Pacific Islander' },
                    { value: 'Mixed Race', label: 'Mixed Race' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' }
                ])
                .build(),
            Builder(FormField)
                .key('dateOfAdmission')
                .dataType('date')
                .title('Date of Admission')
                .label('Date of Admission')
                .formControl(new FormControl(
                    resident.dateOfAdmission ?
                        new Date(resident.dateOfAdmission).toISOString().split('T')[0] : ''
                ))
                .build(),
            Builder(FormField)
                .key('medicalPowerOfAttorney')
                .dataType('text')
                .title('Medical Power of Attorney')
                .label('Medical Power of Attorney')
                .formControl(new FormControl(resident.medicalPowerOfAttorney || ''))
                .build(),
            Builder(FormField)
                .key('preferredPharmacy')
                .dataType('text')
                .title('Preferred Pharmacy')
                .label('Preferred Pharmacy')
                .formControl(new FormControl(resident.preferredPharmacy || ''))
                .build()
        ];
    });

    ngOnInit(): void {
        if (this.resident) {
            this.residentData.set(this.resident);
        }
    }

    ngOnChanges(): void {
        if (this.resident) {
            this.residentData.set(this.resident);
        }
    }

    onSave(formData: Record<string, unknown>): void {
        console.log('Saving personal info - in component:', formData);
        const currentResident = this.resident;
        if (!currentResident) return;

        const updatedResident = Builder(Resident)
            .id(currentResident.id)
            .firstName(formData['firstName'] as string || '')
            .lastName(formData['lastName'] as string || '')
            .email(formData['email'] as string || '')
            .role(formData['role'] as string || 'ROLE_RESIDENT')
            .sexAtBirth(formData['sexAtBirth'] as string || '')
            .dateOfBirth(formData['dateOfBirth'] as string || currentResident.dateOfBirth)
            .socialSecurityNumber(formData['socialSecurityNumber'] as string || '')
            .maritalStatus(formData['maritalStatus'] as string || '')
            .religion(formData['religion'] as string || '')
            .primaryLanguage(formData['primaryLanguage'] as string || '')
            .ethnicity(formData['ethnicity'] as string || '')
            .photoUrl(formData['photoUrl'] as string || null)
            .dateOfAdmission(formData['dateOfAdmission'] as string || '')
            .medicalPowerOfAttorney(formData['medicalPowerOfAttorney'] as string || '')
            .preferredPharmacy(formData['preferredPharmacy'] as string || '')
            // Preserve existing nested objects and arrays
            .contactInfo(currentResident.contactInfo)
            .medicalAndLegalStatus(currentResident.medicalAndLegalStatus)
            .guardians(currentResident.guardians)
            .powerOfAttorney(currentResident.powerOfAttorney)
            .medicalProxy(currentResident.medicalProxy)
            .preNeedMedicalAuth(currentResident.preNeedMedicalAuth)
            .primaryCarePhysician(currentResident.primaryCarePhysician)
            .allergy(currentResident.allergy)
            .hospice(currentResident.hospice)
            .socialWorker(currentResident.socialWorker)
            .facility(currentResident.facility)
            .userFacility(currentResident.userFacility)
            .documents(currentResident.documents)
            .insurances(currentResident.insurances)
            .audit(currentResident.audit)
            .build();

        this.residentData.set(updatedResident);
        this.save.emit(updatedResident);
    }

    onCancel(): void {
        this.cancel.emit();
    }

    onEdit(): void {
        this.edit.emit();
    }
}
