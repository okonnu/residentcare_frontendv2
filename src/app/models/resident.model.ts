export class Audit {
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export class ContactInfo {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
}

export class MedicalAndLegalStatus {
    id: string;
    diagnostics: any[];
    allergies: any[];
    physicianOrdersForLifeSustainingTreatment: any | null;
    fullCode: boolean;
    dnr: boolean;
    dni: boolean;
    comfortMeasures: boolean;
}

export class PrimaryCarePhysician {
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

export class Allergy {
    id: string;
    name: string;
    description: string | null;
    reaction: string | null;
    severity: string | null;
    audit: Audit | null;
}

export class SocialWorker {
    id: string;
    name: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export class Facility {
    id: string;
    name: string;
    contactInfo: ContactInfo;
    roomNumber: string | null;
    admissionDate: string | null;
    dischargeDate: string | null;
    levelOfCare: string | null;
}

export class Guardian {
    // Define based on your guardian structure
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export class PowerOfAttorney {
    // Define based on your power of attorney structure
    id: string;
    firstName: string;
    lastName: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export class MedicalProxy {
    // Define based on your medical proxy structure
    id: string;
    firstName: string;
    lastName: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export class PreNeedMedicalAuth {
    // Define based on your pre-need medical authorization structure
    id: string;
    authorizationType: string;
    details: string;
    audit: Audit;
}

export class Hospice {
    // Define based on your hospice structure
    id: string;
    name: string;
    contactInfo: ContactInfo;
    audit: Audit;
}

export class Document {
    // Define based on your document structure
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    audit: Audit;
}

export class Insurance {
    // Define based on your insurance structure
    id: string;
    provider: string;
    policyNumber: string;
    groupNumber: string;
    effectiveDate: string;
    expirationDate: string;
    audit: Audit;
}

export class Resident {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string; // always ROLE_RESIDENT
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
    preferredPharmacy: string;
    contactInfo: ContactInfo | null;
    medicalAndLegalStatus: MedicalAndLegalStatus;
    guardians: Guardian[];
    powerOfAttorney: PowerOfAttorney | null;
    medicalProxy: MedicalProxy | null;
    preNeedMedicalAuth: PreNeedMedicalAuth | null;
    primaryCarePhysician: PrimaryCarePhysician[];
    allergy: Allergy[];
    hospice: Hospice | null;
    socialWorker: SocialWorker;
    facility: Facility;
    userFacility: Facility;
    documents: Document[];
    insurances: Insurance[];
    audit: Audit;
}
