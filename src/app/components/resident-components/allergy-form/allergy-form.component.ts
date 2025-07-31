import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Allergy } from "src/app/models/resident.model";
import { FormField } from 'src/app/models/FormField.model';
import { Builder } from 'builder-pattern';
import { TableFormComponent } from 'src/app/components/table-form/table-form.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'app-allergy-form',
    standalone: true,
    imports: [CommonModule, TableFormComponent, MaterialModule],
    templateUrl: './allergy-form.component.html',
    styleUrls: ['./allergy-form.component.scss']
})
export class AllergyFormComponent implements OnInit, OnChanges {
    @Input() allergies: Allergy[] = [];
    @Input() title: string = 'Allergies';
    @Input() subtitle: string = 'Manage allergy information';
    @Input() showAddButton: boolean = true;
    @Input() showEditButton: boolean = true;
    @Input() showDeleteButton: boolean = true;
    @Input() showViewButton: boolean = true;

    @Output() save = new EventEmitter<Allergy[]>();
    @Output() allergyAdded = new EventEmitter<Allergy>();
    @Output() allergyUpdated = new EventEmitter<Allergy>();
    @Output() allergyDeleted = new EventEmitter<Allergy>();
    @Output() allergyViewed = new EventEmitter<Allergy>();
    @Output() cancel = new EventEmitter<void>();

    // Signal to hold the allergies data
    private allergiesData = signal<Allergy[]>([]);

    // Form controls for table form
    allergyFormControls: FormField[] = [
        Builder(FormField)
            .key('name')
            .dataType('text')
            .title('Allergy Name')
            .label('Allergy Name')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .key('reaction')
            .dataType('text')
            .title('Reaction')
            .label('Reaction')
            .formControl(new FormControl(''))
            .build(),
        Builder(FormField)
            .key('severity')
            .dataType('select')
            .title('Severity')
            .label('Severity')
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
            .dataType('textarea')
            .title('Description')
            .label('Description')
            .formControl(new FormControl(''))
            .build()
    ];

    ngOnInit(): void {
        this.allergiesData.set(this.allergies || []);
    }

    ngOnChanges(): void {
        this.allergiesData.set(this.allergies || []);
    }

    private createDefaultAllergy(): Allergy {
        return Builder(Allergy)
            .id(Date.now().toString())
            .name('')
            .description(null)
            .reaction(null)
            .severity(null)
            .audit(null)
            .build();
    }

    onTableSave(allergyData: Record<string, unknown>): void {
        const allergies = [...this.allergiesData()];
        const existingIndex = allergies.findIndex(a => a.id === allergyData['id'] as string);

        const updatedAllergy = Builder(Allergy)
            .id(allergyData['id'] as string || Date.now().toString())
            .name(allergyData['name'] as string || '')
            .reaction(allergyData['reaction'] as string || null)
            .severity(allergyData['severity'] as string || null)
            .description(allergyData['description'] as string || null)
            .audit(null) // Always ignored as requested
            .build();

        if (existingIndex >= 0) {
            // Update existing allergy
            allergies[existingIndex] = updatedAllergy;
            this.allergyUpdated.emit(updatedAllergy);
        } else {
            // Add new allergy
            allergies.push(updatedAllergy);
            this.allergyAdded.emit(updatedAllergy);
        }

        this.allergiesData.set(allergies);
        this.save.emit(allergies);
    }

    onDelete(allergy: Allergy): void {
        const allergies = this.allergiesData().filter(a => a.id !== allergy.id);
        this.allergiesData.set(allergies);
        this.allergyDeleted.emit(allergy);
        this.save.emit(allergies);
    }

    onView(allergy: Allergy): void {
        this.allergyViewed.emit(allergy);
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
