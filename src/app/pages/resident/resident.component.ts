import { Component, OnInit, ViewEncapsulation, inject, computed } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ResidentService } from 'src/app/services/resident.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Resident } from 'src/app/models/resident.model';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  styleUrls: ['./resident.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResidentComponent implements OnInit {
  residentService = inject(ResidentService);
  private route = inject(ActivatedRoute);

  // Computed properties for easy access
  resident = computed(() => this.residentService.resident());
  isLoading = computed(() => this.residentService.isLoading());

  ngOnInit(): void {
    // Get resident ID from route params
    const residentId = this.route.snapshot.paramMap.get('id');
    if (residentId) {
      this.residentService.getResidentDetails(residentId);
    } else if (!this.resident()) {
      // If no ID provided and no resident loaded, you might want to redirect or show an error
      console.warn('No resident ID provided in route and no resident currently loaded');
    }
    // If there's already a resident loaded in the service, we'll display it
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  formatPhoneNumber(phone: string | null | undefined): string {
    if (!phone) return 'Not provided';
    // Basic phone formatting (XXX) XXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  getFullName(person: any): string {
    if (!person) return 'Not provided';
    return `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Not provided';
  }

  getFullAddress(contactInfo: any): string {
    if (!contactInfo) return 'Not provided';
    const parts = [
      contactInfo.street,
      contactInfo.city,
      contactInfo.state,
      contactInfo.zipCode,
      contactInfo.country
    ].filter(part => part && part.trim());

    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  }

  printProfile(): void {
    window.print();
  }

  hasItems(array: any[] | null | undefined): boolean {
    return !!(array && array.length > 0);
  }

  viewDocument(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  downloadDocument(url: string): void {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
