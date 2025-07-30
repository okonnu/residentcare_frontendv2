import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'empty-state',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
    @Input() icon: string = 'inbox';
    @Input() title: string = 'No data available';
    @Input() description: string = 'There is no data to display at this time.';
    @Input() actionButtonText: string = '';
    @Input() actionButtonIcon: string = '';
    @Input() showActionButton: boolean = false;
    @Input() minHeight: string = '80vh';
    @Input() isLoading: boolean = false;

    @Output() actionClick = new EventEmitter<void>();

    onActionClick(): void {
        this.actionClick.emit();
    }
}
