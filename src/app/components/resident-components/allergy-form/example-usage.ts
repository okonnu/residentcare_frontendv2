// Example usage of the refactored AllergyForm component with table-form

import { Component } from '@angular/core';
import { Allergy } from 'src/app/models/resident.model';
import { AllergyFormComponent } from './allergy-form.component';

@Component({
    selector: 'app-example',
    template: `
    <div class="container">
      <h2>Patient Allergies Management</h2>
      
      <app-allergy-form 
        [allergies]="patientAllergies"
        [title]="'Patient Allergies'"
        [subtitle]="'Manage all known allergies and reactions'"
        [showAddButton]="true"
        [showEditButton]="true"
        [showDeleteButton]="true"
        [showViewButton]="true"
        (save)="onAllergiesSave($event)"
        (allergyAdded)="onAllergyAdded($event)"
        (allergyUpdated)="onAllergyUpdated($event)"
        (allergyDeleted)="onAllergyDeleted($event)"
        (allergyViewed)="onAllergyViewed($event)"
        (cancel)="onAllergyCancel()">
      </app-allergy-form>
      
      <div class="summary" *ngIf="patientAllergies.length > 0">
        <h3>Summary</h3>
        <p>Total Allergies: {{ patientAllergies.length }}</p>
        <p>Life-threatening: {{ getLifeThreateningCount() }}</p>
      </div>
    </div>
  `,
    standalone: true,
    imports: [AllergyFormComponent]
})
export class ExampleUsageComponent {
    patientAllergies: Allergy[] = [
        {
            id: '1',
            name: 'Penicillin',
            reaction: 'Rash and swelling',
            severity: 'Severe',
            description: 'Developed severe allergic reaction during previous treatment',
            audit: null
        },
        {
            id: '2',
            name: 'Peanuts',
            reaction: 'Anaphylaxis',
            severity: 'Life-threatening',
            description: 'Severe peanut allergy since childhood',
            audit: null
        }
    ];

    onAllergiesSave(allergies: Allergy[]): void {
        console.log('Complete allergies array updated:', allergies);
        this.patientAllergies = allergies;
        // Here you would typically save to your backend service
        // this.patientService.updateAllergies(this.patientId, allergies);
    }

    onAllergyAdded(allergy: Allergy): void {
        console.log('New allergy added:', allergy);
        // Optional: Show success notification
        // this.notificationService.success(`New allergy "${allergy.name}" added`);
    }

    onAllergyUpdated(allergy: Allergy): void {
        console.log('Allergy updated:', allergy);
        // Optional: Show success notification
        // this.notificationService.success(`Allergy "${allergy.name}" updated`);
    }

    onAllergyDeleted(allergy: Allergy): void {
        console.log('Allergy deleted:', allergy);
        // Optional: Show success notification
        // this.notificationService.success(`Allergy "${allergy.name}" deleted`);
    }

    onAllergyViewed(allergy: Allergy): void {
        console.log('Viewing allergy details:', allergy);
        // Optional: Open detailed view modal
        // this.dialog.open(AllergyDetailComponent, { data: allergy });
    }

    onAllergyCancel(): void {
        console.log('Allergy operation cancelled');
    }

    getLifeThreateningCount(): number {
        return this.patientAllergies.filter(a => a.severity === 'Life-threatening').length;
    }
}
