import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { TableFormComponent } from '../../components/table-form-v2/table-form.component';
import { FormField } from '../../models/FormField';
import { Builder } from 'builder-pattern';

/**
 * Example component demonstrating the simplified table-form-v2 component
 * This has been refactored from the original table-form to use the new FormField-based approach
 */

@Component({
    selector: 'table-form-example',
    standalone: true,
    imports: [CommonModule, TableFormComponent],
    template: `
    <div class="container-fluid">
      <!-- Using the simplified table-form-v2 component -->
      <table-form
        [title]="'Employee Management'"
        [subtitle]="'Enhanced table with validation using FormField configuration'"
        [dataSet]="employeeData"
        [formControls]="formControls"
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
    </div>
  `
})
export class TableFormExampleComponent implements OnInit, AfterViewInit {
    // Sample data with enhanced properties
    records = [
        {
            id: 1,
            full_name: 'John Doe',
            email_address: 'john.doe@company.com',
            job_position: 'Senior Developer',
            department: 'IT',
            annual_salary: 75000,
            hire_date: '2020-01-15',
            phone_number: '555-0123',
            employment_status: 'active'
        },
        {
            id: 2,
            full_name: 'Jane Smith',
            email_address: 'jane.smith@company.com',
            job_position: 'UX Designer',
            department: 'Design',
            annual_salary: 70000,
            hire_date: '2019-05-10',
            phone_number: '555-0456',
            employment_status: 'active'
        },
        {
            id: 3,
            full_name: 'Robert Johnson',
            email_address: 'robert.johnson@company.com',
            job_position: 'HR Manager',
            department: 'HR',
            annual_salary: 85000,
            hire_date: '2018-11-20',
            phone_number: '555-0789',
            employment_status: 'inactive'
        },
        {
            id: 4,
            full_name: 'Emily Davis',
            email_address: 'emily.davis@company.com',
            job_position: 'Financial Analyst',
            department: 'Finance',
            annual_salary: 68000,
            hire_date: '2021-03-08',
            phone_number: '555-0321',
            employment_status: 'active'
        }
    ];

    // This property will be bound to the table component
    employeeData: any[] = [];

    // Form controls configuration for table-form-v2
    formControls: FormField[] = [
        Builder(FormField)
            .dataType('text')
            .title('Full Name')
            .formControl(new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
            .build(),
        Builder(FormField)
            .dataType('email')
            .title('Email Address')
            .formControl(new FormControl('', [Validators.required, Validators.email]))
            .build(),
        Builder(FormField)
            .dataType('text')
            .title('Job Position')
            .formControl(new FormControl('', [Validators.required, Validators.minLength(3)]))
            .build(),
        Builder(FormField)
            .dataType('select')
            .title('Department')
            .dropDownOptions([
                { value: 'IT', label: 'Information Technology' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance & Accounting' },
                { value: 'Design', label: 'Design & Creative' },
                { value: 'Marketing', label: 'Marketing & Sales' },
                { value: 'Operations', label: 'Operations' }
            ])
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .dataType('number')
            .title('Annual Salary')
            .formControl(new FormControl('', [Validators.required, Validators.min(30000), Validators.max(200000)]))
            .build(),
        Builder(FormField)
            .dataType('date')
            .title('Hire Date')
            .formControl(new FormControl('', [Validators.required]))
            .build(),
        Builder(FormField)
            .dataType('tel')
            .title('Phone Number')
            .formControl(new FormControl('', [Validators.pattern(/^[\d\s\-\(\)]+$/)]))
            .build(),
        Builder(FormField)
            .dataType('select')
            .title('Employment Status')
            .dropDownOptions([
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'onLeave', label: 'On Leave' },
                { value: 'terminated', label: 'Terminated' }
            ])
            .formControl(new FormControl('', [Validators.required]))
            .build()
    ];

    refreshData() {
        // Force Angular change detection by creating a new array reference
        this.employeeData = [...this.records];
        console.log('Data refreshed:', this.employeeData.length, 'records');
    }

    ngOnInit() {
        console.log('Enhanced Table Form Example initialized with', this.records.length, 'records');

        // Initialize data
        this.refreshData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            console.log('After view init - Employee data loaded:', this.employeeData.length, 'records');
        });
    }

    /**
     * Handle save event - works for both Add and Edit modes
     * The component automatically validates all form fields before calling this method
     */
    handleSave(record: any) {
        console.log('Save event received with validated data:', record);

        try {
            if (record.id) {
                // Edit Mode: Update existing record
                const index = this.records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    this.records[index] = { ...record };
                    console.log('Successfully updated employee:', record.full_name);
                    this.showSuccessMessage(`Employee ${record.full_name} updated successfully!`);
                }
            } else {
                // Add Mode: Add new record with auto-generated ID
                const newId = Math.max(...this.records.map(r => r.id), 0) + 1;
                const newRecord = { ...record, id: newId };
                this.records.push(newRecord);
                console.log('Successfully added new employee:', newRecord.full_name);
                this.showSuccessMessage(`Employee ${newRecord.full_name} added successfully!`);
            }

            // Trigger change detection by creating new array reference
            this.refreshData();

        } catch (error) {
            console.error('Error saving employee:', error);
            this.showErrorMessage('Error saving employee data. Please try again.');
        }
    }

    /**
     * Handle delete event with confirmation
     */
    handleDelete(record: any) {
        console.log('Delete request for employee:', record.full_name);

        // Additional confirmation for delete
        if (confirm(`Are you sure you want to delete employee ${record.full_name}? This action cannot be undone.`)) {
            try {
                const index = this.records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    this.records.splice(index, 1);
                    this.refreshData();
                    console.log('Successfully deleted employee:', record.full_name);
                    this.showSuccessMessage(`Employee ${record.full_name} deleted successfully.`);
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                this.showErrorMessage('Error deleting employee. Please try again.');
            }
        }
    }

    /**
     * Handle view event - currently just logs (view mode is handled internally by component)
     */
    handleView(record: any) {
        console.log('View mode activated for employee:', record.full_name);
        // Note: View mode is now handled internally by the table-form component
        // This event is mainly for logging or additional custom logic
    }

    /**
     * Handle cancel event
     */
    handleCancel() {
        console.log('Operation cancelled by user');
        // You can add custom logic here if needed when user cancels
    }

    /**
     * Utility method to show success messages
     */
    private showSuccessMessage(message: string) {
        // In a real app, you might use MatSnackBar or a toast service
        console.log('SUCCESS:', message);
        // Example: this.snackBar.open(message, 'Close', { duration: 3000 });
    }

    /**
     * Utility method to show error messages
     */
    private showErrorMessage(message: string) {
        // In a real app, you might use MatSnackBar or a toast service
        console.error('ERROR:', message);
        // Example: this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
    }
}
