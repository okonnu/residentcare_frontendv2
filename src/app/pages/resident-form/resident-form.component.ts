import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { CardFormComponent } from 'src/app/components/card-form/card-form.component';
import { TableFormComponent } from 'src/app/components/table-form/table-form.component';
import { FormField } from 'src/app/models/FormField.model';
import { Builder } from 'builder-pattern';
import { ResidentService } from 'src/app/services/resident.service';
import { Insurance, Resident } from 'src/app/models/resident.model';

@Component({
    selector: 'app-resident-form',
    standalone: true,
    imports: [CommonModule, MaterialModule, CardFormComponent, TableFormComponent],
    templateUrl: './resident-form.component.html',
    styleUrls: ['./resident-form.component.scss']
})
export class ResidentFormComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private residentService = inject(ResidentService);

    currentStep = signal(0);
    isEditMode = signal(false);
    residentId = signal<string | null>(null);

    // Store resident data for form population
    residentData = signal<Resident | null>(null);

    steps = [
        { label: 'Personal Information', icon: 'person' },
        { label: 'Contact Information', icon: 'contact_phone' },
        { label: 'Facility Information', icon: 'business' },
        { label: 'Medical & Legal Status', icon: 'medical_services' },
        { label: 'Guardians', icon: 'family_restroom' },
        { label: 'Primary Care Physicians', icon: 'local_hospital' },
        { label: 'Allergies', icon: 'warning' },
        { label: 'Legal Representatives', icon: 'gavel' },
        { label: 'Care Team', icon: 'people' },
        { label: 'Documents', icon: 'description' },
        { label: 'Insurance', icon: 'security' }
    ];

    // Computed property to check if each step is completed
    isStepCompleted = computed(() => {
        const resident = this.residentData();
        if (!resident) return Array(this.steps.length).fill(false);

        return [
            // Step 0: Personal Information (required: firstName, lastName, sexAtBirth, dateOfBirth)
            !!(resident.firstName && resident.lastName && resident.sexAtBirth && resident.dateOfBirth),

            // Step 1: Contact Information (required: street, city, state)
            !!(resident.contactInfo?.street && resident.contactInfo?.city && resident.contactInfo?.state),

            // Step 2: Facility Information (required: name, roomNumber)
            !!(resident.facility?.name && resident.facility?.roomNumber),

            // Step 3: Medical & Legal Status (at least one field filled)
            !!(resident.medicalAndLegalStatus?.fullCode !== undefined || resident.medicalAndLegalStatus?.dnr !== undefined),

            // Step 4: Guardians (at least one guardian with required fields)
            !!(resident.guardians && resident.guardians.length > 0 &&
                resident.guardians.some(g => g.firstName && g.lastName && g.relationship)),

            // Step 5: Primary Care Physicians (at least one physician with required fields)
            !!(resident.primaryCarePhysician && resident.primaryCarePhysician.length > 0 &&
                resident.primaryCarePhysician.some(p => p.firstName && p.lastName)),

            // Step 6: Allergies (at least one allergy with name)
            !!(resident.allergy && resident.allergy.length > 0 &&
                resident.allergy.some(a => a.name)),

            // Step 7: Legal Representatives (at least one representative with name)
            !!(resident.powerOfAttorney?.firstName || resident.medicalProxy?.firstName),

            // Step 8: Care Team (at least one team member)
            !!(resident.socialWorker?.name || resident.hospice?.name || resident.preferredPharmacy),

            // Step 9: Documents (at least one document)
            !!(resident.documents && resident.documents.length > 0 &&
                resident.documents.some(d => d.name && d.type)),

            // Step 10: Insurance (at least one insurance)
            !!(resident.insurances && resident.insurances.length > 0 &&
                resident.insurances.some(i => i.provider && i.policyNumber))
        ];
    });

    // Computed property for completion percentage
    completionPercentage = computed(() => {
        const resident = this.residentData();
        if (!resident) return 0;

        let filledFields = 0;
        const totalFields = 32; // Total countable fields across all steps

        // Personal Information (6 fields)
        if (resident.firstName) filledFields++;
        if (resident.lastName) filledFields++;
        if (resident.email) filledFields++;
        if (resident.sexAtBirth) filledFields++;
        if (resident.dateOfBirth) filledFields++;
        if (resident.socialSecurityNumber) filledFields++;

        // Contact Information (5 fields)
        if (resident.contactInfo?.street) filledFields++;
        if (resident.contactInfo?.city) filledFields++;
        if (resident.contactInfo?.state) filledFields++;
        if (resident.contactInfo?.zipCode) filledFields++;
        if (resident.contactInfo?.phoneNumber) filledFields++;

        // Facility Information (3 fields)
        if (resident.facility?.name) filledFields++;
        if (resident.facility?.roomNumber) filledFields++;
        if (resident.facility?.levelOfCare) filledFields++;

        // Medical & Legal Status (2 fields)
        if (resident.medicalAndLegalStatus?.fullCode !== undefined) filledFields++;
        if (resident.medicalAndLegalStatus?.dnr !== undefined) filledFields++;

        // Guardians (count as 3 fields if any exist)
        if (resident.guardians && resident.guardians.length > 0) filledFields += 3;

        // Primary Care Physicians (count as 3 fields if any exist)
        if (resident.primaryCarePhysician && resident.primaryCarePhysician.length > 0) filledFields += 3;

        // Allergies (count as 2 fields if any exist)
        if (resident.allergy && resident.allergy.length > 0) filledFields += 2;

        // Legal Representatives (2 fields)
        if (resident.powerOfAttorney?.firstName) filledFields++;
        if (resident.medicalProxy?.firstName) filledFields++;

        // Care Team (3 fields)
        if (resident.socialWorker?.name) filledFields++;
        if (resident.hospice?.name) filledFields++;
        if (resident.preferredPharmacy) filledFields++;

        // Documents (count as 2 fields if any exist)
        if (resident.documents && resident.documents.length > 0) filledFields += 2;

        // Insurance (count as 2 fields if any exist)
        if (resident.insurances && resident.insurances.length > 0) filledFields += 2;

        return Math.round((filledFields / totalFields) * 100);
    });

    ngOnInit(): void {
        // Check if we're in edit mode
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.residentId.set(id);
            this.loadResidentData(id);
        } else {
            // Initialize empty resident for new form
            this.residentData.set(this.createEmptyResident());
        }
    }

    // Personal Information FormFields
    personalInfoFields = computed(() => {
        const resident = this.residentData();
        if (!resident) return [];

        return [
            Builder(FormField)
                .key('firstName')
                .dataType('text')
                .title('First Name')
                .formControl(new FormControl(resident.firstName || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('lastName')
                .dataType('text')
                .title('Last Name')
                .formControl(new FormControl(resident.lastName || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('email')
                .dataType('email')
                .title('Email')
                .formControl(new FormControl(resident.email || '', [Validators.email]))
                .build(),
            Builder(FormField)
                .key('sexAtBirth')
                .dataType('select')
                .title('Sex at Birth')
                .formControl(new FormControl(resident.sexAtBirth || '', [Validators.required]))
                .dropDownOptions([
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' }
                ])
                .build(),
            Builder(FormField)
                .key('dateOfBirth')
                .dataType('date')
                .title('Date of Birth')
                .formControl(new FormControl(resident.dateOfBirth ? new Date(resident.dateOfBirth).toISOString().split('T')[0] : '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('socialSecurityNumber')
                .dataType('text')
                .title('Social Security Number')
                .formControl(new FormControl(resident.socialSecurityNumber || ''))
                .build()
        ];
    });

    // Contact Information FormFields
    contactInfoFields = computed(() => {
        const resident = this.residentData();
        const contact = resident?.contactInfo;

        return [
            Builder(FormField)
                .key('street')
                .dataType('text')
                .title('Street Address')
                .formControl(new FormControl(contact?.street || ''))
                .build(),
            Builder(FormField)
                .key('city')
                .dataType('text')
                .title('City')
                .formControl(new FormControl(contact?.city || ''))
                .build(),
            Builder(FormField)
                .key('state')
                .dataType('text')
                .title('State')
                .formControl(new FormControl(contact?.state || ''))
                .build(),
            Builder(FormField)
                .key('zipCode')
                .dataType('text')
                .title('Zip Code')
                .formControl(new FormControl(contact?.zipCode || ''))
                .build(),
            Builder(FormField)
                .key('phoneNumber')
                .dataType('text')
                .title('Phone Number')
                .formControl(new FormControl(contact?.phoneNumber || ''))
                .build()
        ];
    });

    // Facility Information FormFields
    facilityInfoFields = computed(() => {
        const resident = this.residentData();
        const facility = resident?.facility;

        return [
            Builder(FormField)
                .key('facilityName')
                .dataType('text')
                .title('Facility Name')
                .formControl(new FormControl(facility?.name || ''))
                .build(),
            Builder(FormField)
                .key('roomNumber')
                .dataType('text')
                .title('Room Number')
                .formControl(new FormControl(facility?.roomNumber || ''))
                .build(),
            Builder(FormField)
                .key('levelOfCare')
                .dataType('select')
                .title('Level of Care')
                .formControl(new FormControl(facility?.levelOfCare || ''))
                .dropDownOptions([
                    { value: 'Independent Living', label: 'Independent Living' },
                    { value: 'Assisted Living', label: 'Assisted Living' },
                    { value: 'Memory Care', label: 'Memory Care' },
                    { value: 'Skilled Nursing', label: 'Skilled Nursing' }
                ])
                .build()
        ];
    });

    // Medical Status FormFields
    medicalStatusFields = computed(() => {
        const resident = this.residentData();
        const medical = resident?.medicalAndLegalStatus;

        return [
            Builder(FormField)
                .key('fullCode')
                .dataType('radio')
                .title('Full Code')
                .formControl(new FormControl(medical?.fullCode ? 'Yes' : 'No'))
                .dropDownOptions([
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ])
                .build(),
            Builder(FormField)
                .key('dnr')
                .dataType('radio')
                .title('Do Not Resuscitate (DNR)')
                .formControl(new FormControl(medical?.dnr ? 'Yes' : 'No'))
                .dropDownOptions([
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ])
                .build()
        ];
    });

    // Guardian data for table form
    guardians = computed(() => this.residentData()?.guardians || []);

    // Guardian form controls for table form
    guardianFormControls: FormField[] = [
        Builder(FormField)
            .key('firstName')
            .dataType('text')
            .title('First Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('lastName')
            .dataType('text')
            .title('Last Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('relationship')
            .dataType('select')
            .title('Relationship')
            .formControl(new FormControl('', [Validators.required]))
            .dropDownOptions([
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Child', label: 'Child' },
                { value: 'Parent', label: 'Parent' },
                { value: 'Sibling', label: 'Sibling' },
                { value: 'Other Family', label: 'Other Family' },
                { value: 'Friend', label: 'Friend' },
                { value: 'Legal Guardian', label: 'Legal Guardian' }
            ])
            .build(),
        Builder(FormField)
            .key('phoneNumber')
            .dataType('text')
            .title('Phone Number')
            .formControl(new FormControl(''))
            .build()
    ];

    // Primary Care Physician data for table form
    primaryCarePhysicians = computed(() => this.residentData()?.primaryCarePhysician || []);

    // Primary Care Physician form controls for table form
    physicianFormControls: FormField[] = [
        Builder(FormField)
            .key('firstName')
            .dataType('text')
            .title('First Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('lastName')
            .dataType('text')
            .title('Last Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('specialization')
            .dataType('text')
            .title('Specialization')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('hospital')
            .dataType('text')
            .title('Hospital/Clinic')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('phoneNumber')
            .dataType('text')
            .title('Phone Number')
            .formControl(new FormControl(''))
            .build()
    ];

    // Allergy data for table form
    allergies = computed(() => this.residentData()?.allergy || []);

    // Allergy form controls for table form
    allergyFormControls: FormField[] = [
        Builder(FormField)
            .key('name')
            .dataType('text')
            .title('Allergy Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('reaction')
            .dataType('text')
            .title('Reaction')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('severity')
            .dataType('select')
            .title('Severity')
            .formControl(new FormControl(''))
            .dropDownOptions([
                { value: 'Mild', label: 'Mild' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Severe', label: 'Severe' },
                { value: 'Life-threatening', label: 'Life-threatening' }
            ])
            .build(),
        Builder(FormField)
            .key('description')
            .dataType('text')
            .title('Description')
            .formControl(new FormControl(''))
            .build()
    ];

    // Legal Representatives FormFields (keeping existing approach for consistency)
    legalRepresentativesFields = computed(() => {
        const resident = this.residentData();
        const poa = resident?.powerOfAttorney;
        const medicalProxy = resident?.medicalProxy;

        return [
            // Power of Attorney fields
            Builder(FormField)
                .key('poaFirstName')
                .dataType('text')
                .title('POA First Name')
                .formControl(new FormControl(poa?.firstName || ''))
                .build(),
            Builder(FormField)
                .key('poaLastName')
                .dataType('text')
                .title('POA Last Name')
                .formControl(new FormControl(poa?.lastName || ''))
                .build(),
            Builder(FormField)
                .key('poaPhone')
                .dataType('text')
                .title('POA Phone Number')
                .formControl(new FormControl(poa?.contactInfo?.phoneNumber || ''))
                .build(),
            // Medical Proxy fields
            Builder(FormField)
                .key('medicalProxyFirstName')
                .dataType('text')
                .title('Medical Proxy First Name')
                .formControl(new FormControl(medicalProxy?.firstName || ''))
                .build(),
            Builder(FormField)
                .key('medicalProxyLastName')
                .dataType('text')
                .title('Medical Proxy Last Name')
                .formControl(new FormControl(medicalProxy?.lastName || ''))
                .build(),
            Builder(FormField)
                .key('medicalProxyPhone')
                .dataType('text')
                .title('Medical Proxy Phone')
                .formControl(new FormControl(medicalProxy?.contactInfo?.phoneNumber || ''))
                .build()
        ];
    });

    // Care Team FormFields (keeping existing approach for consistency)
    careTeamFields = computed(() => {
        const resident = this.residentData();
        const socialWorker = resident?.socialWorker;
        const hospice = resident?.hospice;

        return [
            Builder(FormField)
                .key('socialWorkerName')
                .dataType('text')
                .title('Social Worker Name')
                .formControl(new FormControl(socialWorker?.name || ''))
                .build(),
            Builder(FormField)
                .key('socialWorkerPhone')
                .dataType('text')
                .title('Social Worker Phone')
                .formControl(new FormControl(socialWorker?.contactInfo?.phoneNumber || ''))
                .build(),
            Builder(FormField)
                .key('hospiceName')
                .dataType('text')
                .title('Hospice Name')
                .formControl(new FormControl(hospice?.name || ''))
                .build(),
            Builder(FormField)
                .key('hospicePhone')
                .dataType('text')
                .title('Hospice Phone')
                .formControl(new FormControl(hospice?.contactInfo?.phoneNumber || ''))
                .build(),
            Builder(FormField)
                .key('preferredPharmacy')
                .dataType('text')
                .title('Preferred Pharmacy')
                .formControl(new FormControl(resident?.preferredPharmacy || ''))
                .build()
        ];
    });

    // Document data for table form
    documents = computed(() => this.residentData()?.documents || []);

    // Document form controls for table form
    documentFormControls: FormField[] = [
        Builder(FormField)
            .key('name')
            .dataType('text')
            .title('Document Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('type')
            .dataType('select')
            .title('Document Type')
            .formControl(new FormControl('', [Validators.required]))
            .dropDownOptions([
                { value: 'ID', label: 'Identification' },
                { value: 'Medical', label: 'Medical Record' },
                { value: 'Legal', label: 'Legal Document' },
                { value: 'Insurance', label: 'Insurance Card' },
                { value: 'Other', label: 'Other' }
            ])
            .build(),
        Builder(FormField)
            .key('url')
            .dataType('text')
            .title('File URL')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('uploadDate')
            .dataType('date')
            .title('Upload Date')
            .formControl(new FormControl(new Date().toISOString().split('T')[0]))
            .build()
    ];

    // Insurance data for table form
    insurances = computed(() => this.residentData()?.insurances || []);

    // Insurance form controls for table form
    insuranceFormControls: FormField[] = [
        Builder(FormField)
            .key('provider')
            .dataType('text')
            .title('Insurance Provider')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('policyNumber')
            .dataType('text')
            .title('Policy Number')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('groupNumber')
            .dataType('text')
            .title('Group Number')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('effectiveDate')
            .dataType('date')
            .title('Effective Date')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('expirationDate')
            .dataType('date')
            .title('Expiration Date')
            .formControl(new FormControl(''))
            .build()
    ];

    createEmptyResident(): Resident {
        return Builder(Resident).build();
    }

    loadResidentData(id: string): void {
        this.residentService.getResidentDetails(id);
        const resident = this.residentService.resident();
        if (resident) {
            this.residentData.set(resident);
        }
    }

    nextStep(): void {
        if (this.currentStep() < this.steps.length - 1) {
            this.currentStep.set(this.currentStep() + 1);
        }
    }

    previousStep(): void {
        if (this.currentStep() > 0) {
            this.currentStep.set(this.currentStep() - 1);
        }
    }

    goToStep(step: number): void {
        // Check if current step has valid data before allowing navigation
        const currentStepValid = this.isCurrentStepValid();
        const currentStepHasData = this.currentStepHasData();

        // Allow navigation if current step is valid and has data, or if going to a previous step
        if (step <= this.currentStep() || (currentStepValid && currentStepHasData)) {
            this.currentStep.set(step);
        }
    }

    isStepValid(step: number): boolean {
        const completionStatus = this.isStepCompleted();
        return completionStatus[step];
    }

    isCurrentStepValid(): boolean {
        const current = this.currentStep();
        switch (current) {
            case 0: return this.validateFormFields(this.personalInfoFields());
            case 1: return this.validateFormFields(this.contactInfoFields());
            case 2: return this.validateFormFields(this.facilityInfoFields());
            case 3: return this.validateFormFields(this.medicalStatusFields());
            case 7: return this.validateFormFields(this.legalRepresentativesFields());
            case 8: return this.validateFormFields(this.careTeamFields());
            default: return true; // Table forms are always considered valid if they have data
        }
    }

    currentStepHasData(): boolean {
        const current = this.currentStep();
        const resident = this.residentData();
        if (!resident) return false;

        switch (current) {
            case 0: return !!(resident.firstName || resident.lastName || resident.email ||
                resident.sexAtBirth || resident.dateOfBirth || resident.socialSecurityNumber);
            case 1: return !!(resident.contactInfo?.street || resident.contactInfo?.city ||
                resident.contactInfo?.state || resident.contactInfo?.zipCode ||
                resident.contactInfo?.phoneNumber);
            case 2: return !!(resident.facility?.name || resident.facility?.roomNumber ||
                resident.facility?.levelOfCare);
            case 3: return !!(resident.medicalAndLegalStatus?.fullCode !== undefined ||
                resident.medicalAndLegalStatus?.dnr !== undefined);
            case 4: return !!(resident.guardians && resident.guardians.length > 0);
            case 5: return !!(resident.primaryCarePhysician && resident.primaryCarePhysician.length > 0);
            case 6: return !!(resident.allergy && resident.allergy.length > 0);
            case 7: return !!(resident.powerOfAttorney?.firstName || resident.medicalProxy?.firstName);
            case 8: return !!(resident.socialWorker?.name || resident.hospice?.name || resident.preferredPharmacy);
            case 9: return !!(resident.documents && resident.documents.length > 0);
            case 10: return !!(resident.insurances && resident.insurances.length > 0);
            default: return true;
        }
    }

    validateFormFields(fields: FormField[]): boolean {
        return fields.every(field => field.formControl.valid);
    }

    onPersonalInfoSave(formData: any): void {
        this.updateResidentData(formData);
        this.nextStep();
    }

    onContactInfoSave(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = {
                ...currentResident,
                contactInfo: {
                    street: formData.street || '',
                    city: formData.city || '',
                    state: formData.state || '',
                    zipCode: formData.zipCode || '',
                    country: currentResident.contactInfo?.country || '',
                    phoneNumber: formData.phoneNumber || ''
                }
            };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    onFacilityInfoSave(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = {
                ...currentResident,
                facility: {
                    id: currentResident.facility?.id || '',
                    name: formData.facilityName || '',
                    contactInfo: currentResident.facility?.contactInfo || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: ''
                    },
                    roomNumber: formData.roomNumber || '',
                    admissionDate: currentResident.facility?.admissionDate || '',
                    dischargeDate: currentResident.facility?.dischargeDate || '',
                    levelOfCare: formData.levelOfCare || ''
                }
            };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    onMedicalStatusSave(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = {
                ...currentResident,
                medicalAndLegalStatus: {
                    id: currentResident.medicalAndLegalStatus?.id || '',
                    diagnostics: currentResident.medicalAndLegalStatus?.diagnostics || [],
                    allergies: currentResident.medicalAndLegalStatus?.allergies || [],
                    physicianOrdersForLifeSustainingTreatment: currentResident.medicalAndLegalStatus?.physicianOrdersForLifeSustainingTreatment || null,
                    fullCode: formData.fullCode === 'Yes',
                    dnr: formData.dnr === 'Yes',
                    dni: currentResident.medicalAndLegalStatus?.dni || false,
                    comfortMeasures: currentResident.medicalAndLegalStatus?.comfortMeasures || false
                }
            };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    onGuardiansSave(tableData: any[]): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, guardians: tableData };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    // Table form event handlers for Guardians
    onGuardianTableSave(guardian: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const guardians = [...(currentResident.guardians || [])];
            const existingIndex = guardians.findIndex(g => g.id === guardian.id);

            if (existingIndex >= 0) {
                // Update existing guardian
                guardians[existingIndex] = guardian;
            } else {
                // Add new guardian with ID
                guardians.push({ ...guardian, id: guardian.id || Date.now().toString() });
            }

            const updatedResident = { ...currentResident, guardians };
            this.residentData.set(updatedResident);
        }
    }

    onGuardianDelete(guardian: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const guardians = (currentResident.guardians || []).filter(g => g.id !== guardian.id);
            const updatedResident = { ...currentResident, guardians };
            this.residentData.set(updatedResident);
        }
    }

    onGuardianView(guardian: any): void {
        // Handle viewing guardian details if needed
        console.log('Viewing guardian:', guardian);
    }

    onGuardianCancel(): void {
        // Handle cancel action if needed
        console.log('Guardian operation cancelled');
    }

    onPhysiciansSave(tableData: any[]): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, primaryCarePhysician: tableData };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    // Table form event handlers for Primary Care Physicians
    onPhysicianTableSave(physician: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const physicians = [...(currentResident.primaryCarePhysician || [])];
            const existingIndex = physicians.findIndex(p => p.id === physician.id);

            if (existingIndex >= 0) {
                // Update existing physician
                physicians[existingIndex] = physician;
            } else {
                // Add new physician with ID and required fields
                physicians.push({
                    ...physician,
                    id: physician.id || "",
                    email: physician.email || '',
                    role: null,
                    userFacility: null,
                    contactInfo: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: physician.phoneNumber || ''
                    },
                    audit: {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                });
            }

            const updatedResident = { ...currentResident, primaryCarePhysician: physicians };
            this.residentData.set(updatedResident);
        }
    }

    onPhysicianDelete(physician: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const physicians = (currentResident.primaryCarePhysician || []).filter(p => p.id !== physician.id);
            const updatedResident = { ...currentResident, primaryCarePhysician: physicians };
            this.residentData.set(updatedResident);
        }
    }

    onPhysicianView(physician: any): void {
        console.log('Viewing physician:', physician);
    }

    onPhysicianCancel(): void {
        console.log('Physician operation cancelled');
    }

    onAllergiesSave(tableData: any[]): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, allergy: tableData };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    // Table form event handlers for Allergies
    onAllergyTableSave(allergy: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const allergies = [...(currentResident.allergy || [])];
            const existingIndex = allergies.findIndex(a => a.id === allergy.id);

            if (existingIndex >= 0) {
                // Update existing allergy
                allergies[existingIndex] = allergy;
            } else {
                // Add new allergy with ID and required fields
                allergies.push({
                    ...allergy,
                    id: allergy.id || Date.now().toString(),
                    audit: {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                });
            }

            const updatedResident = { ...currentResident, allergy: allergies };
            this.residentData.set(updatedResident);
        }
    }

    onAllergyDelete(allergy: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const allergies = (currentResident.allergy || []).filter(a => a.id !== allergy.id);
            const updatedResident = { ...currentResident, allergy: allergies };
            this.residentData.set(updatedResident);
        }
    }

    onAllergyView(allergy: any): void {
        console.log('Viewing allergy:', allergy);
    }

    onAllergyCancel(): void {
        console.log('Allergy operation cancelled');
    }

    onLegalRepresentativesSave(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            // Map the form data to the correct resident structure
            const updatedResident = {
                ...currentResident,
                powerOfAttorney: formData.poaFirstName || formData.poaLastName || formData.poaPhone ? {
                    id: currentResident.powerOfAttorney?.id || '',
                    firstName: formData.poaFirstName || '',
                    lastName: formData.poaLastName || '',
                    contactInfo: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: formData.poaPhone || ''
                    },
                    audit: currentResident.powerOfAttorney?.audit || {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                } : currentResident.powerOfAttorney,
                medicalProxy: formData.medicalProxyFirstName || formData.medicalProxyLastName || formData.medicalProxyPhone ? {
                    id: currentResident.medicalProxy?.id || '',
                    firstName: formData.medicalProxyFirstName || '',
                    lastName: formData.medicalProxyLastName || '',
                    contactInfo: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: formData.medicalProxyPhone || ''
                    },
                    audit: currentResident.medicalProxy?.audit || {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                } : currentResident.medicalProxy
            };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    onCareTeamSave(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            // Map the form data to the correct resident structure
            const updatedResident = {
                ...currentResident,
                socialWorker: formData.socialWorkerName || formData.socialWorkerPhone ? {
                    id: currentResident.socialWorker?.id || '',
                    name: formData.socialWorkerName || '',
                    contactInfo: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: formData.socialWorkerPhone || ''
                    },
                    audit: currentResident.socialWorker?.audit || {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                } : currentResident.socialWorker,
                hospice: formData.hospiceName || formData.hospicePhone ? {
                    id: currentResident.hospice?.id || '',
                    name: formData.hospiceName || '',
                    contactInfo: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        phoneNumber: formData.hospicePhone || ''
                    },
                    audit: currentResident.hospice?.audit || {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                } : currentResident.hospice,
                preferredPharmacy: formData.preferredPharmacy || ''
            };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    onDocumentsSave(tableData: any[]): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, documents: tableData };
            this.residentData.set(updatedResident);
        }
        this.nextStep();
    }

    // Table form event handlers for Documents
    onDocumentTableSave(document: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const documents = [...(currentResident.documents || [])];
            const existingIndex = documents.findIndex(d => d.id === document.id);

            if (existingIndex >= 0) {
                // Update existing document
                documents[existingIndex] = document;
            } else {
                // Add new document with ID and required fields
                documents.push({
                    ...document,
                    id: document.id || Date.now().toString(),
                    audit: {
                        createdBy: '',
                        createdDate: new Date().toISOString(),
                        lastModifiedBy: '',
                        lastModifiedDate: new Date().toISOString()
                    }
                });
            }

            const updatedResident = { ...currentResident, documents };
            this.residentData.set(updatedResident);
        }
    }

    onDocumentDelete(document: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const documents = (currentResident.documents || []).filter(d => d.id !== document.id);
            const updatedResident = { ...currentResident, documents };
            this.residentData.set(updatedResident);
        }
    }

    onDocumentView(document: any): void {
        console.log('Viewing document:', document);
    }

    onDocumentCancel(): void {
        console.log('Document operation cancelled');
    }

    onInsurancesSave(tableData: Insurance[]): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, insurances: tableData };
            this.residentData.set(updatedResident);
        }
        this.saveResident();
    }

    // Table form event handlers for Insurance
    onInsuranceTableSave(insurance: Insurance): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const insurances = [...(currentResident.insurances || [])];
            const existingIndex = insurances.findIndex(i => i.id === insurance.id);

            if (existingIndex >= 0) {
                // Update existing insurance
                insurances[existingIndex] = insurance;
            } else {
                // Add new insurance with ID
                insurances.push({
                    ...insurance,
                    id: insurance.id || Date.now().toString()
                });
            }

            const updatedResident = { ...currentResident, insurances };
            this.residentData.set(updatedResident);
        }
    }

    onInsuranceDelete(insurance: Insurance): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const insurances = (currentResident.insurances || []).filter(i => i.id !== insurance.id);
            const updatedResident = { ...currentResident, insurances };
            this.residentData.set(updatedResident);
        }
    }

    onInsuranceView(insurance: Insurance): void {
        console.log('Viewing insurance:', insurance);
    }

    onInsuranceCancel(): void {
        console.log('Insurance operation cancelled');
    }

    updateResidentData(formData: any): void {
        const currentResident = this.residentData();
        if (currentResident) {
            const updatedResident = { ...currentResident, ...formData };
            this.residentData.set(updatedResident);
        }
    }

    saveResident(): void {
        const residentData = this.residentData();
        if (residentData) {
            this.residentService.saveResidentDetails(residentData);
            this.router.navigate(['/resident', residentData.id || '']);
        }
    }

    isFormValid(): boolean {
        const completionStatus = this.isStepCompleted();
        // Form is valid if at least the first 3 essential steps are completed
        return completionStatus[0] && completionStatus[1] && completionStatus[2];
    }

    cancel(): void {
        this.router.navigate(['/resident']);
    }
}
