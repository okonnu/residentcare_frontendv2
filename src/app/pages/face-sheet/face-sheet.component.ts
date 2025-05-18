import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CardFormComponent, Structure } from '../../components/card-form/card-form.component';

@Component({
  selector: 'face-sheet',
  templateUrl: './face-sheet.component.html',
  standalone: true,
  imports: [MaterialModule, CardFormComponent],
  styleUrls: ['./face-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaceSheetComponent {
  image = 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  personalInfo: Structure[] = [
    {
      color: 'primary',
      title: 'Full Name',
      icon: 'assets/images/svgs/icon-user.svg',
      value: 'John Doe',
    },
    {
      color: 'primary',
      title: 'Date of Birth (DOB)',
      icon: 'assets/images/svgs/icon-calendar.svg',
      value: 'January 1, 1980',
    },
    {
      color: 'primary',
      title: 'Gender',
      icon: 'assets/images/svgs/icon-gender.svg',
      value: 'Male',
    },
    {
      color: 'primary',
      title: 'Social Security Number (SSN)',
      icon: 'assets/images/svgs/icon-ssn.svg',
      value: '123-45-6789',
    },
    {
      color: 'primary',
      title: 'Marital Status',
      icon: 'assets/images/svgs/icon-marital-status.svg',
      value: 'Single',
    },
    {
      color: 'primary',
      title: 'Primary Language',
      icon: 'assets/images/svgs/icon-language.svg',
      value: 'English',
    },
    {
      color: 'primary',
      title: 'Religion',
      icon: 'assets/images/svgs/icon-religion.svg',
      value: 'Christianity',
    },
    {
      color: 'primary',
      title: 'Veteran Status',
      icon: 'assets/images/svgs/icon-veteran.svg',
      value: 'Not a Veteran',
    },
    {
      color: 'primary',
      title: 'Ethnicity/Race',
      icon: 'assets/images/svgs/icon-ethnicity.svg',
      value: 'Caucasian',
    },
    {
      color: 'primary',
      title: 'Photo of Resident',
      icon: 'assets/images/svgs/icon-photo.svg',
      value: 'path/to/photo.jpg',
    },
  ];

  contactInfo: Structure[] = [
    {
      color: 'primary',
      title: 'Primary Address (Facility/Home)',
      icon: 'assets/images/svgs/icon-address.svg',
      value: '123 Main St, Anytown, USA',
    },
    {
      color: 'primary',
      title: 'Phone Number',
      icon: 'assets/images/svgs/icon-phone.svg',
      value: '(123) 456-7890',
    },
    {
      color: 'primary',
      title: 'Email Address (if applicable)',
      icon: 'assets/images/svgs/icon-email.svg',
      value: 'john.doe@example.com',
    },
  ];

  medicalLegalStatus: Structure[] = [
    {
      color: 'primary',
      title: 'Primary Diagnosis',
      icon: 'assets/images/svgs/icon-diagnosis.svg',
      value: 'Hypertension',
    },
    {
      color: 'primary',
      title: 'Secondary Diagnoses (if applicable)',
      icon: 'assets/images/svgs/icon-diagnosis.svg',
      value: 'Diabetes',
    },
    {
      color: 'primary',
      title: 'Allergies (Food, Medications, Environmental)',
      icon: 'assets/images/svgs/icon-allergy.svg',
      value: 'Peanuts, Penicillin',
    },
    {
      color: 'primary',
      title: 'DNR Status (Do Not Resuscitate)',
      icon: 'assets/images/svgs/icon-dnr.svg',
      value: 'Yes',
    },
    {
      color: 'primary',
      title: 'POLST (Physician Orders for Life-Sustaining Treatment)',
      icon: 'assets/images/svgs/icon-polst.svg',
      value: 'Yes',
    },
    {
      color: 'primary',
      title: 'Code Status (Full Code, DNR, DNI, Comfort Measures Only)',
      icon: 'assets/images/svgs/icon-code-status.svg',
      value: 'DNR',
    },
  ];

  insuranceFinancialInfo: Structure[] = [
    {
      color: 'primary',
      title: 'Primary Insurance Provider (Medicare, Medicaid, Private)',
      icon: 'assets/images/svgs/icon-insurance.svg',
      value: 'Medicare',
    },
    {
      color: 'primary',
      title: 'Policy Number & Group Number',
      icon: 'assets/images/svgs/icon-policy.svg',
      value: '123456789, Group 98765',
    },
    {
      color: 'primary',
      title: 'Secondary Insurance (if applicable)',
      icon: 'assets/images/svgs/icon-insurance.svg',
      value: 'None',
    },
    {
      color: 'primary',
      title: 'Medicaid ID (if applicable)',
      icon: 'assets/images/svgs/icon-medicaid.svg',
      value: 'None',
    },
  ];

  responsiblePartyContacts: Structure[] = [
    {
      color: 'primary',
      title: 'Primary Responsible Party (Spouse, Family Member, Guardian)',
      icon: 'assets/images/svgs/icon-responsible-party.svg',
      value: 'Jane Doe',
    },
    {
      color: 'primary',
      title: 'Name',
      icon: 'assets/images/svgs/icon-name.svg',
      value: 'Jane Doe',
    },
    {
      color: 'primary',
      title: 'Relationship',
      icon: 'assets/images/svgs/icon-relationship.svg',
      value: 'Spouse',
    },
    {
      color: 'primary',
      title: 'Phone Number',
      icon: 'assets/images/svgs/icon-phone.svg',
      value: '(123) 456-7890',
    },
    {
      color: 'primary',
      title: 'Email Address',
      icon: 'assets/images/svgs/icon-email.svg',
      value: 'jane.doe@example.com',
    },
    {
      color: 'primary',
      title: 'Address',
      icon: 'assets/images/svgs/icon-address.svg',
      value: '123 Main St, Anytown, USA',
    },
    {
      color: 'primary',
      title: 'Secondary Emergency Contact',
      icon: 'assets/images/svgs/icon-emergency-contact.svg',
      value: 'John Smith',
    },
    {
      color: 'primary',
      title: 'Tertiary Emergency Contact (if applicable)',
      icon: 'assets/images/svgs/icon-emergency-contact.svg',
      value: 'None',
    },
  ];

  legalDocumentsDecisionMakers: Structure[] = [
    {
      color: 'primary',
      title: 'Power of Attorney (POA)',
      icon: 'assets/images/svgs/icon-poa.svg',
      value: 'Jane Doe',
    },
    {
      color: 'primary',
      title: 'Name',
      icon: 'assets/images/svgs/icon-name.svg',
      value: 'Jane Doe',
    },
    {
      color: 'primary',
      title: 'Relationship',
      icon: 'assets/images/svgs/icon-relationship.svg',
      value: 'Spouse',
    },
    {
      color: 'primary',
      title: 'Contact Information',
      icon: 'assets/images/svgs/icon-contact.svg',
      value: '(123) 456-7890, jane.doe@example.com',
    },
    {
      color: 'primary',
      title: 'Type of POA (Medical, Financial, Both)',
      icon: 'assets/images/svgs/icon-poa-type.svg',
      value: 'Both',
    },
    {
      color: 'primary',
      title: 'Medical Proxy (if different from POA)',
      icon: 'assets/images/svgs/icon-medical-proxy.svg',
      value: 'None',
    },
    {
      color: 'primary',
      title: 'Legal Guardian (if applicable)',
      icon: 'assets/images/svgs/icon-legal-guardian.svg',
      value: 'None',
    },
    {
      color: 'primary',
      title: 'PMA (Pre-Need Medical Authorization, if applicable)',
      icon: 'assets/images/svgs/icon-pma.svg',
      value: 'None',
    },
    {
      color: 'primary',
      title: 'Advance Directives (uploaded or documented)',
      icon: 'assets/images/svgs/icon-advance-directives.svg',
      value: 'Uploaded',
    },
  ];

  physicianCareTeamInfo: Structure[] = [
    {
      color: 'primary',
      title: 'Primary Care Physician (PCP) Name',
      icon: 'assets/images/svgs/icon-pcp.svg',
      value: 'Dr. John Smith',
    },
    {
      color: 'primary',
      title: 'PCP Contact Information',
      icon: 'assets/images/svgs/icon-contact.svg',
      value: '(123) 456-7890, dr.smith@example.com',
    },
    {
      color: 'primary',
      title: 'Specialists (Cardiologist, Oncologist, etc.)',
      icon: 'assets/images/svgs/icon-specialist.svg',
      value: 'Dr. Jane Doe (Cardiologist)',
    },
    {
      color: 'primary',
      title: 'Preferred Pharmacy & Contact',
      icon: 'assets/images/svgs/icon-pharmacy.svg',
      value: 'ABC Pharmacy, (123) 456-7890',
    },
    {
      color: 'primary',
      title: 'Home Health/Hospice Agency Name & Contact',
      icon: 'assets/images/svgs/icon-hospice.svg',
      value: 'XYZ Hospice, (123) 456-7890',
    },
    {
      color: 'primary',
      title: 'Case Manager or Social Worker Contact',
      icon: 'assets/images/svgs/icon-case-manager.svg',
      value: 'John Doe, (123) 456-7890',
    },
  ];

  facilityInfo: Structure[] = [
    {
      color: 'primary',
      title: 'Facility Name',
      icon: 'assets/images/svgs/icon-facility.svg',
      value: 'Sunrise Assisted Living',
    },
    {
      color: 'primary',
      title: 'Room Number',
      icon: 'assets/images/svgs/icon-room.svg',
      value: '101',
    },
    {
      color: 'primary',
      title: 'Admission Date',
      icon: 'assets/images/svgs/icon-admission-date.svg',
      value: 'January 1, 2020',
    },
    {
      color: 'primary',
      title: 'Level of Care (Skilled Nursing, Memory Care, Hospice, etc.)',
      icon: 'assets/images/svgs/icon-level-of-care.svg',
      value: 'Skilled Nursing',
    },
  ];

  additionalNotesDocuments: Structure[] = [
    {
      color: 'primary',
      title: 'Uploaded Legal Documents (DNR, POA, Advance Directives, POLST, etc.)',
      icon: 'assets/images/svgs/icon-documents.svg',
      value: 'Uploaded',
    },
    {
      color: 'primary',
      title: 'Behavioral Notes (if applicable)',
      icon: 'assets/images/svgs/icon-behavioral-notes.svg',
      value: 'None',
    },
    {
      color: 'primary',
      title: 'Special Needs (e.g., Oxygen, Mobility Aid, Dietary Restrictions)',
      icon: 'assets/images/svgs/icon-special-needs.svg',
      value: 'Oxygen, Wheelchair',
    },
  ];
}