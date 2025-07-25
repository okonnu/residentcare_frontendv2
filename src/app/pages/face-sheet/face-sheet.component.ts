import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CardFormComponent, Structure } from '../../components/card-form/card-form.component';
import { TableColumn, TableFormComponent } from '../../components/table-form/table-form.component';
import { ResidentService } from 'src/app/services/resident.service';
import { Resident } from '../../models/resident.interface';

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

  // Get resident data from the service signal
  resident = computed(() => this.residentService.resident() as Resident);

  // Personal Information Card
  personalInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];

    return [
      {
        title: 'First Name',
        value: residentData.firstName || '',
        dataType: 'text',
        required: true,
        validators: [Validators.required, Validators.minLength(2)]
      },
      {
        title: 'Last Name',
        value: residentData.lastName || '',
        dataType: 'text',
        required: true,
        validators: [Validators.required, Validators.minLength(2)]
      },
      {
        title: 'Email',
        value: residentData.email || '',
        dataType: 'email',
        required: false,
        validators: [Validators.email]
      },
      {
        title: 'Date of Birth',
        value: residentData.dateOfBirth ? new Date(residentData.dateOfBirth).toISOString().split('T')[0] : '',
        dataType: 'date',
        required: true,
        validators: [Validators.required]
      },
      {
        title: 'Sex at Birth',
        value: residentData.sexAtBirth || '',
        dataType: 'select',
        required: true,
        validators: [Validators.required],
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ]
      },
      {
        title: 'Social Security Number',
        value: residentData.socialSecurityNumber || '',
        dataType: 'ssn',
        required: true,
        validators: [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]
      }
    ] as Structure[];
  });

  // Demographics & Admission Information
  demographicsInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];

    return [
      {
        title: 'Marital Status',
        value: residentData.maritalStatus || '',
        dataType: 'select',
        required: false,
        options: [
          { value: 'Single', label: 'Single' },
          { value: 'Married', label: 'Married' },
          { value: 'Divorced', label: 'Divorced' },
          { value: 'Widowed', label: 'Widowed' },
          { value: 'Separated', label: 'Separated' }
        ]
      },
      {
        title: 'Religion',
        value: residentData.religion || '',
        dataType: 'text',
        required: false
      },
      {
        title: 'Primary Language',
        value: residentData.primaryLanguage || '',
        dataType: 'text',
        required: false
      },
      {
        title: 'Ethnicity',
        value: residentData.ethnicity || '',
        dataType: 'text',
        required: false
      },
      {
        title: 'Date of Admission',
        value: residentData.dateOfAdmission ? new Date(residentData.dateOfAdmission).toISOString().split('T')[0] : '',
        dataType: 'date',
        required: true,
        validators: [Validators.required]
      },
      {
        title: 'Medical Power of Attorney',
        value: residentData.medicalPowerOfAttorney || '',
        dataType: 'text',
        required: false
      }
    ] as Structure[];
  });

  // Medical & Legal Status
  medicalLegalStatus = computed(() => {
    const residentData = this.resident();
    if (!residentData?.medicalAndLegalStatus) return [];

    const status = residentData.medicalAndLegalStatus;
    return [
      {
        title: 'Full Code',
        value: status.fullCode ? 'Yes' : 'No',
        dataType: 'radio',
        required: true,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ]
      },
      {
        title: 'DNR (Do Not Resuscitate)',
        value: status.dnr ? 'Yes' : 'No',
        dataType: 'radio',
        required: true,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ]
      },
      {
        title: 'DNI (Do Not Intubate)',
        value: status.dni ? 'Yes' : 'No',
        dataType: 'radio',
        required: true,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ]
      },
      {
        title: 'Comfort Measures',
        value: status.comfortMeasures ? 'Yes' : 'No',
        dataType: 'radio',
        required: true,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ]
      }
    ] as Structure[];
  });

  // Facility Information
  facilityInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData?.facility) return [];

    const facility = residentData.facility;
    return [
      {
        title: 'Facility Name',
        value: facility.name || '',
        dataType: 'text',
        required: true,
        validators: [Validators.required]
      },
      {
        title: 'Facility Phone',
        value: facility.contactInfo?.phoneNumber || '',
        dataType: 'tel',
        required: true,
        validators: [Validators.required]
      },
      {
        title: 'Facility Address',
        value: facility.contactInfo ?
          `${facility.contactInfo.street}, ${facility.contactInfo.city}, ${facility.contactInfo.state} ${facility.contactInfo.zipCode}` : '',
        dataType: 'text',
        required: true,
        validators: [Validators.required]
      },
      {
        title: 'Room Number',
        value: facility.roomNumber || '',
        dataType: 'text',
        required: false
      },
      {
        title: 'Level of Care',
        value: facility.levelOfCare || '',
        dataType: 'select',
        required: false,
        options: [
          { value: 'Skilled Nursing', label: 'Skilled Nursing' },
          { value: 'Assisted Living', label: 'Assisted Living' },
          { value: 'Memory Care', label: 'Memory Care' },
          { value: 'Rehabilitation', label: 'Rehabilitation' }
        ]
      }
    ] as Structure[];
  });

  // Pharmacy Information
  pharmacyInfo = computed(() => {
    const residentData = this.resident();
    if (!residentData) return [];

    return [
      {
        title: 'Preferred Pharmacy',
        value: residentData.preferredPharmacy || '',
        dataType: 'text',
        required: false
      }
    ] as Structure[];
  });

  // Primary Care Physicians data
  primaryCarePhysicians = computed(() => {
    const residentData = this.resident();
    if (!residentData?.primaryCarePhysician) return [];

    return residentData.primaryCarePhysician.map(physician => ({
      id: physician.id,
      physicianName: `Dr. ${physician.firstName} ${physician.lastName}`,
      email: physician.email,
      phone: physician.contactInfo?.phoneNumber || '',
      specialization: physician.specialization,
      hospital: physician.hospital,
      address: physician.contactInfo ?
        `${physician.contactInfo.street}, ${physician.contactInfo.city}, ${physician.contactInfo.state} ${physician.contactInfo.zipCode}` : ''
    }));
  });

  // Column definitions for physicians table
  physicianColumns: TableColumn[] = [
    { key: 'physicianName', title: 'Physician Name', dataType: 'text', required: true, validators: [Validators.required] },
    { key: 'email', title: 'Email', dataType: 'email', required: true, validators: [Validators.required, Validators.email] },
    { key: 'phone', title: 'Phone', dataType: 'tel', required: true, validators: [Validators.required] },
    { key: 'specialization', title: 'Specialization', dataType: 'text', required: false },
    { key: 'hospital', title: 'Hospital', dataType: 'text', required: false },
    { key: 'address', title: 'Address', dataType: 'text', required: false }
  ];

  // Allergies data
  allergies = computed(() => {
    const residentData = this.resident();
    if (!residentData?.allergy) return [];

    return residentData.allergy.map(allergy => ({
      id: allergy.id,
      allergyName: allergy.name,
      description: allergy.description || '',
      reaction: allergy.reaction || '',
      severity: allergy.severity || ''
    }));
  });

  // Column definitions for allergies table
  allergyColumns: TableColumn[] = [
    { key: 'allergyName', title: 'Allergy Name', dataType: 'text', required: true, validators: [Validators.required] },
    { key: 'description', title: 'Description', dataType: 'text', required: false },
    { key: 'reaction', title: 'Reaction', dataType: 'text', required: false },
    {
      key: 'severity', title: 'Severity', dataType: 'select', required: false,
      options: [
        { value: 'Mild', label: 'Mild' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Severe', label: 'Severe' },
        { value: 'Life-threatening', label: 'Life-threatening' }
      ]
    }
  ];

  // Service providers data
  serviceProviders = computed(() => {
    const residentData = this.resident();
    const providers = [];

    // Add social worker if exists
    if (residentData?.socialWorker) {
      providers.push({
        id: residentData.socialWorker.id,
        providerType: 'Social Worker',
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
        providerType: 'Hospice Care',
        name: residentData.hospice.name,
        phone: residentData.hospice.contactInfo?.phoneNumber || '',
        address: residentData.hospice.contactInfo ?
          `${residentData.hospice.contactInfo.street}, ${residentData.hospice.contactInfo.city}, ${residentData.hospice.contactInfo.state} ${residentData.hospice.contactInfo.zipCode}` : ''
      });
    }

    return providers;
  });

  // Column definitions for service providers table
  serviceProviderColumns: TableColumn[] = [
    {
      key: 'providerType', title: 'Provider Type', dataType: 'select', required: true,
      validators: [Validators.required],
      options: [
        { value: 'Social Worker', label: 'Social Worker' },
        { value: 'Hospice Care', label: 'Hospice Care' },
        { value: 'Physical Therapist', label: 'Physical Therapist' },
        { value: 'Occupational Therapist', label: 'Occupational Therapist' },
        { value: 'Speech Therapist', label: 'Speech Therapist' },
        { value: 'Dietitian', label: 'Dietitian' }
      ]
    },
    { key: 'name', title: 'Name', dataType: 'text', required: true, validators: [Validators.required] },
    { key: 'phone', title: 'Phone', dataType: 'tel', required: true, validators: [Validators.required] },
    { key: 'address', title: 'Address', dataType: 'text', required: false }
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