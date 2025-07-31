import { Component, Input, Output, EventEmitter, computed, signal, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactInfo } from "src/app/models/resident.model";
import { FormField } from 'src/app/models/FormField.model';
import { Builder } from 'builder-pattern';
import { CardFormComponent } from 'src/app/components/card-form/card-form.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'app-contact-info',
    standalone: true,
    imports: [CommonModule, CardFormComponent, MaterialModule],
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnChanges {
    @Input() contactInfo: ContactInfo | null = null;
    @Input() editMode: boolean = true;
    @Input() showEditButton: boolean = false;
    @Input() showCancelButton: boolean = true;
    @Input() saveButtonText: string = 'Save Contact Info';
    @Input() cancelButtonText: string = 'Cancel';

    @Output() save = new EventEmitter<ContactInfo>();
    @Output() cancel = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    // Signal to hold the contact info data
    private contactInfoData = signal<ContactInfo>(this.createDefaultContactInfo());

    // Computed property for form fields
    contactInfoFields = computed(() => {
        const contact = this.contactInfo || this.contactInfoData();

        return [
            Builder(FormField)
                .key('street')
                .dataType('text')
                .title('Street Address')
                .label('Street Address')
                .formControl(new FormControl(contact.street || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('city')
                .dataType('text')
                .title('City')
                .label('City')
                .formControl(new FormControl(contact.city || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('state')
                .dataType('text')
                .title('State')
                .label('State')
                .formControl(new FormControl(contact.state || '', [Validators.required]))
                .build(),
            Builder(FormField)
                .key('zipCode')
                .dataType('text')
                .title('Zip Code')
                .label('Zip Code')
                .formControl(new FormControl(contact.zipCode || '', [Validators.pattern(/^\d{5}(-\d{4})?$/)]))
                .build(),
            Builder(FormField)
                .key('country')
                .dataType('text')
                .title('Country')
                .label('Country')
                .formControl(new FormControl(contact.country || 'United States'))
                .build(),
            Builder(FormField)
                .key('phoneNumber')
                .dataType('phone')
                .title('Phone Number')
                .label('Phone Number')
                .formControl(new FormControl(contact.phoneNumber || '', [
                    Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
                ]))
                .build()
        ];
    });

    ngOnInit(): void {
        if (this.contactInfo) {
            this.contactInfoData.set(this.contactInfo);
        }
    }

    ngOnChanges(): void {
        if (this.contactInfo) {
            this.contactInfoData.set(this.contactInfo);
        }
    }

    private createDefaultContactInfo(): ContactInfo {
        return Builder(ContactInfo).build();
    }

    onSave(formData: ContactInfo): void {
        const updatedContactInfo = Builder(ContactInfo)
            .street(formData.street || '')
            .city(formData.city || '')
            .state(formData.state || '')
            .zipCode(formData.zipCode || '')
            .country(formData.country || 'United States')
            .phoneNumber(formData.phoneNumber || '')
            .build();

        this.contactInfoData.set(updatedContactInfo);
        this.save.emit(updatedContactInfo);
    }

    onCancel(): void {
        this.cancel.emit();
    }

    onEdit(): void {
        this.edit.emit();
    }
}