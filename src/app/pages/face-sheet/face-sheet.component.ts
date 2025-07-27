import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CardFormComponent } from '../../components/card-form/card-form.component';
import { TableFormComponent } from '../../components/table-form/table-form.component';
import { FormField } from 'src/app/models/FormField';
import { Builder } from 'builder-pattern';
import { ResidentService } from 'src/app/services/resident.service';
import { Resident } from '../../models/resident.interface';
import { MatDialog } from '@angular/material/dialog';
import { AppSearchDialogComponent } from '../../layouts/full/vertical/header/header.component';

@Component({
  selector: 'face-sheet',
  templateUrl: './face-sheet.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, CardFormComponent, TableFormComponent],
  styleUrls: ['./face-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaceSheetComponent {
  private residentService = inject(ResidentService);
  private dialog = inject(MatDialog);

  // Get resident data from the service signal
  resident = computed(() => this.residentService.resident() as Resident);

  // Get loading state from the service
  isLoading = computed(() => this.residentService.isLoading());

  // Check if we have valid resident data
  hasResidentData = computed(() => {
    const residentData = this.resident();
    return residentData && residentData.id && residentData.id.trim() !== '';
  });

  // Method to open search dialog
  openSearchDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Personal Information Card using FormField with Builder pattern
  personalInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];
    return [
      Builder(FormField)
        .dataType('text')
        .title('First Name')
        .formControl(new FormControl(residentData.firstName || '', [Validators.required, Validators.minLength(2)]))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Last Name')
        .formControl(new FormControl(residentData.lastName || '', [Validators.required, Validators.minLength(2)]))
        .build(),
      Builder(FormField)
        .dataType('email')
        .title('Email')
        .formControl(new FormControl(residentData.email || '', [Validators.email]))
        .build(),
      Builder(FormField)
        .dataType('date')
        .title('Date Of Birth')
        .formControl(new FormControl(residentData.dateOfBirth ? new Date(residentData.dateOfBirth).toISOString().split('T')[0] : '', [Validators.required]))
        .build(),
      Builder(FormField)
        .dataType('select')
        .title('Sex At Birth')
        .formControl(new FormControl(residentData.sexAtBirth || '', [Validators.required]))
        .dropDownOptions([
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ])
        .build(),
      Builder(FormField)
        .dataType('ssn')
        .title('Social Security Number')
        .formControl(new FormControl(residentData.socialSecurityNumber || '', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]))
        .build()
    ];
  });

  // Demographics & Admission Information using FormField with Builder pattern
  demographicsInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];

    return [
      Builder(FormField)
        .dataType('select')
        .title('Marital Status')
        .formControl(new FormControl(residentData.maritalStatus || ''))
        .dropDownOptions([
          { value: 'Single', label: 'Single' },
          { value: 'Married', label: 'Married' },
          { value: 'Divorced', label: 'Divorced' },
          { value: 'Widowed', label: 'Widowed' },
          { value: 'Separated', label: 'Separated' }
        ])
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Religion')
        .formControl(new FormControl(residentData.religion || ''))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Primary Language')
        .formControl(new FormControl(residentData.primaryLanguage || ''))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Ethnicity')
        .formControl(new FormControl(residentData.ethnicity || ''))
        .build(),
      Builder(FormField)
        .dataType('date')
        .title('Date Of Admission')
        .formControl(new FormControl(residentData.dateOfAdmission ? new Date(residentData.dateOfAdmission).toISOString().split('T')[0] : '', [Validators.required]))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Medical Power Of Attorney')
        .formControl(new FormControl(residentData.medicalPowerOfAttorney || ''))
        .build()
    ];
  });

  // Medical & Legal Status using FormField with Builder pattern
  medicalLegalStatus = computed(() => {
    const residentData = this.resident();
    if (!residentData?.medicalAndLegalStatus) return [];

    const status = residentData.medicalAndLegalStatus;
    return [
      Builder(FormField)
        .dataType('radio')
        .title('Full Code')
        .formControl(new FormControl(status.fullCode ? 'Yes' : 'No', [Validators.required]))
        .dropDownOptions([
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ])
        .build(),
      Builder(FormField)
        .dataType('radio')
        .title('DNR Do Not Resuscitate')
        .formControl(new FormControl(status.dnr ? 'Yes' : 'No', [Validators.required]))
        .dropDownOptions([
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ])
        .build(),
      Builder(FormField)
        .dataType('radio')
        .title('DNI Do Not Intubate')
        .formControl(new FormControl(status.dni ? 'Yes' : 'No', [Validators.required]))
        .dropDownOptions([
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ])
        .build(),
      Builder(FormField)
        .dataType('radio')
        .title('Comfort Measures')
        .formControl(new FormControl(status.comfortMeasures ? 'Yes' : 'No', [Validators.required]))
        .dropDownOptions([
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ])
        .build()
    ];
  });

  // Facility Information using FormField with Builder pattern
  facilityInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData?.facility) return [];

    const facility = residentData.facility;
    return [
      Builder(FormField)
        .dataType('text')
        .title('Facility Name')
        .formControl(new FormControl(facility.name || '', [Validators.required]))
        .build(),
      Builder(FormField)
        .dataType('tel')
        .title('Facility Phone')
        .formControl(new FormControl(facility.contactInfo?.phoneNumber || '', [Validators.required]))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Facility Address')
        .formControl(new FormControl(facility.contactInfo ?
          `${facility.contactInfo.street}, ${facility.contactInfo.city}, ${facility.contactInfo.state} ${facility.contactInfo.zipCode}` : '', [Validators.required]))
        .build(),
      Builder(FormField)
        .dataType('text')
        .title('Room Number')
        .formControl(new FormControl(facility.roomNumber || ''))
        .build(),
      Builder(FormField)
        .dataType('select')
        .title('Level Of Care')
        .formControl(new FormControl(facility.levelOfCare || ''))
        .dropDownOptions([
          { value: 'Skilled Nursing', label: 'Skilled Nursing' },
          { value: 'Assisted Living', label: 'Assisted Living' },
          { value: 'Memory Care', label: 'Memory Care' },
          { value: 'Rehabilitation', label: 'Rehabilitation' }
        ])
        .build()
    ];
  });

  // Pharmacy Information using FormField with Builder pattern
  pharmacyInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];

    return [
      Builder(FormField)
        .dataType('text')
        .title('Preferred Pharmacy')
        .formControl(new FormControl(residentData.preferredPharmacy || ''))
        .build()
    ];
  });

  // Primary Care Physicians data with proper field mapping for table-form-v2
  primaryCarePhysicians = computed(() => {
    const residentData = this.resident();
    if (!residentData?.primaryCarePhysician) return [];

    return residentData.primaryCarePhysician.map(physician => ({
      id: physician.id,
      physician_name: `Dr. ${physician.firstName} ${physician.lastName}`,
      email: physician.email,
      phone: physician.contactInfo?.phoneNumber || '',
      specialization: physician.specialization,
      hospital: physician.hospital,
      address: physician.contactInfo ?
        `${physician.contactInfo.street}, ${physician.contactInfo.city}, ${physician.contactInfo.state} ${physician.contactInfo.zipCode}` : ''
    }));
  });

  // FormField configuration for physicians table using Builder pattern
  physicianFormControls: FormField[] = [
    Builder(FormField)
      .dataType('text')
      .title('Physician Name')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('email')
      .title('Email')
      .formControl(new FormControl('', [Validators.required, Validators.email]))
      .build(),
    Builder(FormField)
      .dataType('tel')
      .title('Phone')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Specialization')
      .formControl(new FormControl(''))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Hospital')
      .formControl(new FormControl(''))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Address')
      .formControl(new FormControl(''))
      .build()
  ];

  // Allergies data with proper field mapping for table-form-v2
  allergies = computed(() => {
    const residentData = this.resident();
    if (!residentData?.allergy) return [];

    return residentData.allergy.map(allergy => ({
      id: allergy.id,
      allergy_name: allergy.name,
      description: allergy.description || '',
      reaction: allergy.reaction || '',
      severity: allergy.severity || ''
    }));
  });

  // FormField configuration for allergies table using Builder pattern
  allergyFormControls: FormField[] = [
    Builder(FormField)
      .dataType('text')
      .title('Allergy Name')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Description')
      .formControl(new FormControl(''))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Reaction')
      .formControl(new FormControl(''))
      .build(),
    Builder(FormField)
      .dataType('select')
      .title('Severity')
      .formControl(new FormControl(''))
      .dropDownOptions([
        { value: 'Mild', label: 'Mild' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Severe', label: 'Severe' },
        { value: 'Life-threatening', label: 'Life-threatening' }
      ])
      .build()
  ];

  // Service providers data with proper field mapping for table-form-v2
  serviceProviders = computed(() => {
    const residentData = this.resident();
    const providers = [];

    // Add social worker if exists
    if (residentData?.socialWorker) {
      providers.push({
        id: residentData.socialWorker.id,
        provider_type: 'Social Worker',
        name: residentData.socialWorker.name,
        phone: residentData.socialWorker.contactInfo?.phoneNumber || '',
        address: residentData.socialWorker.contactInfo ?
          `${residentData.socialWorker.contactInfo.street}, ${residentData.socialWorker.contactInfo.city}, ${residentData.socialWorker.contactInfo.state} ${residentData.socialWorker.contactInfo.zipCode}` : ''
      });
    }

    // Add hospice if exists
    if (residentData?.hospice) {
      providers.push({
        id: residentData.hospice.id,
        provider_type: 'Hospice Care',
        name: residentData.hospice.name,
        phone: residentData.hospice.contactInfo?.phoneNumber || '',
        address: residentData.hospice.contactInfo ?
          `${residentData.hospice.contactInfo.street}, ${residentData.hospice.contactInfo.city}, ${residentData.hospice.contactInfo.state} ${residentData.hospice.contactInfo.zipCode}` : ''
      });
    }

    return providers;
  });

  // FormField configuration for service providers table using Builder pattern
  serviceProviderFormControls: FormField[] = [
    Builder(FormField)
      .dataType('select')
      .title('Provider Type')
      .formControl(new FormControl('', [Validators.required]))
      .dropDownOptions([
        { value: 'Social Worker', label: 'Social Worker' },
        { value: 'Hospice Care', label: 'Hospice Care' },
        { value: 'Physical Therapist', label: 'Physical Therapist' },
        { value: 'Occupational Therapist', label: 'Occupational Therapist' },
        { value: 'Speech Therapist', label: 'Speech Therapist' },
        { value: 'Dietitian', label: 'Dietitian' }
      ])
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Name')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('tel')
      .title('Phone')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('text')
      .title('Address')
      .formControl(new FormControl(''))
      .build()
  ];

  // Event handlers for card-form saves
  onPersonalInfoSave(data: any) {
    console.log('Personal info saved:', data);
    // Handle save logic - update resident data through service
  }

  onDemographicsSave(data: any) {
    console.log('Demographics saved:', data);
    // Handle save logic
  }

  onMedicalLegalSave(data: any) {
    console.log('Medical/Legal status saved:', data);
    // Handle save logic
  }

  onFacilitySave(data: any) {
    console.log('Facility info saved:', data);
    // Handle save logic
  }

  onPharmacySave(data: any) {
    console.log('Pharmacy info saved:', data);
    // Handle save logic
  }

  onCancel() {
    console.log('Edit cancelled');
  }

  // Table form handlers
  handlePhysicianSave(data: any) {
    console.log('Physician saved:', data);
    // Handle save logic
  }

  handlePhysicianDelete(id: any) {
    console.log('Physician deleted:', id);
    // Handle delete logic
  }

  handlePhysicianView(data: any) {
    console.log('Physician viewed:', data);
    // Handle view logic
  }

  handleAllergySave(data: any) {
    console.log('Allergy saved:', data);
    // Handle save logic
  }

  handleAllergyDelete(id: any) {
    console.log('Allergy deleted:', id);
    // Handle delete logic
  }

  handleAllergyView(data: any) {
    console.log('Allergy viewed:', data);
    // Handle view logic
  }

  handleServiceProviderSave(data: any) {
    console.log('Service provider saved:', data);
    // Handle save logic
  }

  handleServiceProviderDelete(id: any) {
    console.log('Service provider deleted:', id);
    // Handle delete logic
  }

  handleServiceProviderView(data: any) {
    console.log('Service provider viewed:', data);
    // Handle view logic
  }

  handleCancel() {
    console.log('Table form action cancelled');
  }

}