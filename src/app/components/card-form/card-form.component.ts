import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';

export interface Structure {
  icon: string;
  title: string;
  value: string;
  color: string;
}

@Component({
  selector: 'card-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule],
  templateUrl: './card-form.component.html',
})
export class CardFormComponent {
  @Input() dataSet: Structure[] = [];
  @Input() title: string = '';
  @Input() image: string | null = null;
  editMode: boolean = false;
  trackByTitle(index: number, item: Structure): string {
    return item.title;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}