// Example of how to use the updated table-form component with three modes

import { Component } from '@angular/core';
import { TableColumn } from './table-form.component';

@Component({
    selector: 'app-three-mode-example',
    template: `
    <table-form 
      [title]="'Users'"
      [subtitle]="'Manage user records'"
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
export class ThreeModeExampleComponent {
    users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'active' }
    ];

    userColumns: TableColumn[] = [
        { key: 'name', title: 'Full Name', dataType: 'text', sortable: true },
        { key: 'email', title: 'Email Address', dataType: 'email', sortable: true },
        { key: 'age', title: 'Age', dataType: 'number', sortable: true },
        {
            key: 'status',
            title: 'Status',
            dataType: 'select',
            sortable: true,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' }
            ]
        }
    ];

    /**
     * Handle save event - works for both Add and Edit modes
     * The component automatically determines if it's a new record or an update
     */
    handleSave(record: any) {
        console.log('Save event received:', record);

        // Check if this is a new record (no ID) or existing record (has ID)
        if (record.id) {
            // Edit Mode: Update existing record
            const index = this.users.findIndex(user => user.id === record.id);
            if (index !== -1) {
                this.users[index] = { ...record };
                console.log('Updated existing record:', record);
            }
        } else {
            // Add Mode: Add new record
            const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
            const newRecord = { ...record, id: newId };
            this.users.push(newRecord);
            console.log('Added new record:', newRecord);
        }

        // Trigger change detection by creating new array reference
        this.users = [...this.users];
    }

    /**
     * Handle delete event
     */
    handleDelete(record: any) {
        console.log('Delete event received:', record);
        this.users = this.users.filter(user => user.id !== record.id);
    }

    /**
     * Handle view event - if you want custom view logic
     * Note: The component itself doesn't emit view events in the current implementation
     * as clicking view enters view mode within the component
     */
    handleView(record: any) {
        console.log('View event received:', record);
        // Handle any custom view logic here if needed
    }

    /**
     * Handle cancel event
     */
    handleCancel() {
        console.log('Operation cancelled');
        // Handle any cleanup or notifications if needed
    }
}

/*
Mode Behaviors:

1. VIEW MODE (Default):
   - Displays table with all records
   - Shows "Add Record" button (if showAddButton is true)
   - Each row has action buttons: View, Edit, Delete (based on configuration)
   - This is the default state when component loads

2. EDIT MODE:
   - Triggered by clicking the "Edit" button on any table row
   - Opens form pre-filled with selected record's data
   - Form title: "Edit [Title]"
   - Save button text: "Save Changes"
   - Has Cancel button to return to View mode
   - Emits save event with updated record when saved

3. ADD MODE:
   - Triggered by clicking the "Add Record" button
   - Opens blank form for entering new record data
   - Form title: "Add New [Title]"
   - Save button text: "Add Record"
   - Has Cancel button to return to View mode
   - Emits save event with new record (no ID) when saved

All modes share the same form template but behave differently based on context.
*/
