export interface Audit {
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface ContactInfo {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
}

export interface MedicalAndLegalStatus {
    id: string;
    diagnostics: any[];
    allergies: any[];
    physicianOrdersForLifeSustainingTreatment: any | null;
    fullCode: boolean;
    dnr: boolean;
    dni: boolean;
    comfortMeasures: boolean;
}

export interface PrimaryCarePhysician {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: any | null;
    userFacility: any | null;
    contactInfo: ContactInfo;
    audit: Audit;
    specialization: string;
    hospital: string;
}

export interface Allergy {
    id: string;
    name: string;
    description: string | null;
    reaction: string | null;
    severity: string | null;
    audit: Audit | null;
}

export interface SocialWorker {
    id: string;
    name: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export interface Facility {
    id: string;
    name: string;
    contactInfo: ContactInfo;
    roomNumber: string | null;
    admissionDate: string | null;
    dischargeDate: string | null;
    levelOfCare: string | null;
}

export interface Guardian {
    // Define based on your guardian structure
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export interface PowerOfAttorney {
    // Define based on your power of attorney structure
    id: string;
    firstName: string;
    lastName: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export interface MedicalProxy {
    // Define based on your medical proxy structure
    id: string;
    firstName: string;
    lastName: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export interface PreNeedMedicalAuth {
    // Define based on your pre-need medical authorization structure
    id: string;
    authorizationType: string;
    details: string;
    audit: Audit;
}

export interface Hospice {
    // Define based on your hospice structure
    id: string;
    name: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export interface Document {
    // Define based on your document structure
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    audit: Audit;
}

export interface Insurance {
    // Define based on your insurance structure
    id: string;
    provider: string;
    policyNumber: string;
    groupNumber: string;
    effectiveDate: string;
    expirationDate: string;
    audit: Audit;
}

export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: any | null;
    userFacility: any | null;
    contactInfo: ContactInfo | null;
    audit: Audit;
    sexAtBirth: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    maritalStatus: string;
    religion: string;
    primaryLanguage: string;
    ethnicity: string;
    photoUrl: string | null;
    dateOfAdmission: string;
    medicalPowerOfAttorney: string;
    medicalAndLegalStatus: MedicalAndLegalStatus;
    guardians: Guardian[];
    powerOfAttorney: PowerOfAttorney | null;
    medicalProxy: MedicalProxy | null;
    preNeedMedicalAuth: PreNeedMedicalAuth | null;
    primaryCarePhysician: PrimaryCarePhysician[];
    allergy: Allergy[];
    preferredPharmacy: string;
    hospice: Hospice | null;
    socialWorker: SocialWorker;
    facility: Facility;
    documents: Document[];
    insurances: Insurance[];
}
