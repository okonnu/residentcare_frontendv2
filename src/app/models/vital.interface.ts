/**
 * Interface representing a resident's vital signs
 */
export interface Vital {
    id: string;
    /** Body temperature in Fahrenheit */
    temperature: number;
    
    /** Heart rate in beats per minute */
    heartRate: number;
    
    /** Respiratory rate in breaths per minute */
    respiratoryRate: number;
    
    /** Systolic blood pressure in mmHg */
    systolicBP: number;
    
    /** Diastolic blood pressure in mmHg */
    diastolicBP: number;
    
    /** Oxygen saturation level in percentage */
    oxygenSaturation: number;
    
    /** Weight in pounds */
    weight: number;
    
    /** Height in centimeters */
    height: number;
    
    /** Body Mass Index */
    bmi: number;
    
    /** Pain score on a scale (typically 0-10) */
    painScore: number;
    
    /** Blood glucose level in mg/dL */
    bloodGlucoseLevel: number;
    
    /** ID of the resident this vital belongs to */
    residentId: string;
}