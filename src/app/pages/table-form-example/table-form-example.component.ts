import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { TableFormComponent, TableColumn } from '../../components/table-form/table-form.component';

@Component({
    selector: 'app-table-form-example',
    standalone: true,
    imports: [CommonModule, TableFormComponent],
    template: `
    <div class="container-fluid">
      <table-form
        [title]="'Employee Management'"
        [subtitle]="'Enhanced table with validation and three modes: View, Edit, and Add'"
        [dataSet]="employeeData"
        [columns]="columns"
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
            name: 'John Doe',
            email: 'john.doe@company.com',
            position: 'Senior Developer',
            department: 'IT',
            salary: 75000,
            hireDate: '2020-01-15',
            phone: '555-0123',
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            position: 'UX Designer',
            department: 'Design',
            salary: 70000,
            hireDate: '2019-05-10',
            phone: '555-0456',
            status: 'active'
        },
        {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert.johnson@company.com',
            position: 'HR Manager',
            department: 'HR',
            salary: 85000,
            hireDate: '2018-11-20',
            phone: '555-0789',
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            position: 'Financial Analyst',
            department: 'Finance',
            salary: 68000,
            hireDate: '2021-03-08',
            phone: '555-0321',
            status: 'active'
        }
    ];

    // This property will be bound to the table component
    employeeData: any[] = [];

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

    // Enhanced column definitions with validation
    columns: TableColumn[] = [
        {
            key: 'id',
            title: 'Employee ID',
            dataType: 'number',
            sortable: true,
            width: '100px',
            hidden: false,
            required: false // ID is auto-generated, not required for new records
        },
        {
            key: 'name',
            title: 'Full Name',
            dataType: 'text',
            sortable: true,
            hidden: false,
            required: true, // Required field
            validators: [Validators.minLength(2), Validators.maxLength(50)] // Name length validation
        },
        {
            key: 'email',
            title: 'Email Address',
            dataType: 'email',
            sortable: true,
            hidden: false,
            required: true // Required + automatic email validation
        },
        {
            key: 'position',
            title: 'Job Position',
            dataType: 'text',
            sortable: true,
            hidden: false,
            required: true,
            validators: [Validators.minLength(3)] // Minimum position title length
        },
        {
            key: 'department',
            title: 'Department',
            dataType: 'select',
            sortable: true,
            hidden: false,
            required: true, // Required selection
            options: [
                { value: 'IT', label: 'Information Technology' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance & Accounting' },
                { value: 'Design', label: 'Design & Creative' },
                { value: 'Marketing', label: 'Marketing & Sales' },
                { value: 'Operations', label: 'Operations' }
            ]
        },
        {
            key: 'salary',
            title: 'Annual Salary',
            dataType: 'number',
            sortable: true,
            hidden: false,
            required: true,
            validators: [Validators.min(30000), Validators.max(200000)] // Salary range validation
        },
        {
            key: 'hireDate',
            title: 'Hire Date',
            dataType: 'date',
            sortable: true,
            hidden: false,
            required: true
        },
        {
            key: 'phone',
            title: 'Phone Number',
            dataType: 'tel',
            sortable: false,
            hidden: false,
            required: false, // Optional field
            validators: [Validators.pattern(/^[\d\s\-\(\)]+$/)] // Basic phone pattern
        },
        {
            key: 'status',
            title: 'Employment Status',
            dataType: 'select',
            sortable: true,
            hidden: false,
            required: true, // Required selection
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'onLeave', label: 'On Leave' },
                { value: 'terminated', label: 'Terminated' }
            ]
        }
    ];

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
                    console.log('Successfully updated employee:', record.name);
                    this.showSuccessMessage(`Employee ${record.name} updated successfully!`);
                }
            } else {
                // Add Mode: Add new record with auto-generated ID
                const newId = Math.max(...this.records.map(r => r.id), 0) + 1;
                const newRecord = { ...record, id: newId };
                this.records.push(newRecord);
                console.log('Successfully added new employee:', newRecord.name);
                this.showSuccessMessage(`Employee ${newRecord.name} added successfully!`);
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
        console.log('Delete request for employee:', record.name);

        // Additional confirmation for delete
        if (confirm(`Are you sure you want to delete employee ${record.name}? This action cannot be undone.`)) {
            try {
                const index = this.records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    this.records.splice(index, 1);
                    this.refreshData();
                    console.log('Successfully deleted employee:', record.name);
                    this.showSuccessMessage(`Employee ${record.name} deleted successfully.`);
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
        console.log('View mode activated for employee:', record.name);
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
