// Enhanced example showing how to use table-form with form-input components and validation

import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { TableColumn } from './table-form.component';

@Component({
    selector: 'app-enhanced-table-form-example',
    template: `
    <table-form 
      [title]="'User Management'"
      [subtitle]="'Manage user records with validation'"
      [dataSet]="users"
      [columns]="userColumns"
      [idField]="'id'"
      [showAddButton]="true"
      [showEditButton]="true"
      [showDeleteButton]="true"
      [showViewButton]="true"
      (save)="handleSave($event)"
      (delete)="handleDelete($event)"
      (view)="handleView($event)"
      (cancel)="handleCancel()">
    </table-form>
  `
})
export class EnhancedTableFormExampleComponent {
    users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            age: 30,
            status: 'active',
            phone: '555-1234',
            ssn: '123-45-6789'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            age: 25,
            status: 'inactive',
            phone: '555-5678',
            ssn: '987-65-4321'
        }
    ];

    userColumns: TableColumn[] = [
        {
            key: 'name',
            title: 'Full Name',
            dataType: 'text',
            sortable: true,
            required: true, // This will add required validation
            validators: [Validators.minLength(2)] // Custom validator
        },
        {
            key: 'email',
            title: 'Email Address',
            dataType: 'email',
            sortable: true,
            required: true // Required + email validation (automatic for email type)
        },
        {
            key: 'age',
            title: 'Age',
            dataType: 'number',
            sortable: true,
            required: true,
            validators: [Validators.min(18), Validators.max(120)] // Age range validation
        },
        {
            key: 'phone',
            title: 'Phone Number',
            dataType: 'tel',
            sortable: false,
            required: false
        },
        {
            key: 'ssn',
            title: 'Social Security Number',
            dataType: 'ssn',
            sortable: false,
            required: false,
            hide: true // Hide from table but show in form
        },
        {
            key: 'status',
            title: 'Status',
            dataType: 'select',
            sortable: true,
            required: true,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' }
            ]
        }
    ];

    /**
     * Handle save event with validation
     * The component will automatically validate all form fields before calling this method
     */
    handleSave(record: any) {
        console.log('Save event received with validated data:', record);

        try {
            if (record.id) {
                // Edit Mode: Update existing record
                const index = this.users.findIndex(user => user.id === record.id);
                if (index !== -1) {
                    this.users[index] = { ...record };
                    console.log('Successfully updated user:', record.name);
                }
            } else {
                // Add Mode: Add new record
                const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
                const newRecord = { ...record, id: newId };
                this.users.push(newRecord);
                console.log('Successfully added new user:', newRecord.name);
            }

            // Trigger change detection
            this.users = [...this.users];

        } catch (error) {
            console.error('Error saving user:', error);
        }
    }

    /**
     * Handle delete event
     */
    handleDelete(record: any) {
        console.log('Delete event received:', record);
        try {
            this.users = this.users.filter(user => user.id !== record.id);
            console.log('Successfully deleted user:', record.name);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    /**
     * Handle view event
     */
    handleView(record: any) {
        console.log('View event received:', record);
        // Custom view logic can be added here
    }

    /**
     * Handle cancel event
     */
    handleCancel() {
        console.log('Operation cancelled by user');
    }
}

/*
Enhanced Features with form-input components:

1. AUTOMATIC VALIDATION:
   - Required field validation with visual indicators
   - Email format validation for email fields
   - Custom validators (min/max age, minimum length, etc.)
   - Form submission blocked until all validations pass

2. IMPROVED ERROR HANDLING:
   - Consistent error message display across all input types
   - Error messages show only when field is touched/dirty
   - Visual error indicators with Material Design styling
   - Snackbar notifications for form-level errors

3. BETTER UX:
   - Consistent input styling across all field types
   - Professional form appearance with labels
   - Proper form control state management
   - Reactive forms for better performance

4. FIELD CONFIGURATION:
   - required: boolean - adds required validation
   - validators: array - custom validators from Angular
   - hidden/hide: boolean - hide from table but show in form
   - All existing options still supported

5. SUPPORTED INPUT TYPES:
   - text, email, tel, number, date (using form-input component)
   - select (dropdown with validation)
   - radio (radio buttons with validation)
   - ssn (with masking via form-input)
   - custom (like blood pressure with multiple inputs)

Note: The form will automatically prevent submission if any required fields
are missing or if any custom validators fail. Error messages are displayed
consistently across all input types.
*/
