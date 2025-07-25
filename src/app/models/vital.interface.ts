import { Audit } from './resident.interface';

export interface Vital {
    id: string;
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
    systolicBP: number;
    diastolicBP: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
    bmi: number;
    painScore: number;
    bloodGlucoseLevel: number;
    residentId: string;
    recordedAt: Date; // Added to track when the vital was recorded
    audit: Audit | null;
}

export interface VitalsChartData {
    name: string;
    data: number[];
}

export interface VitalsChartOptions {
    series: VitalsChartData[];
    chart: any;
    xaxis: any;
    yaxis: any;
    colors: string[];
    stroke: any;
    dataLabels: any;
    legend: any;
    grid: any;
    tooltip: any;
}
