import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResidentServicesService {
  // Signal to hold search results
  searchResults = signal<any[]>([]);
  // Signal to track loading state
  isLoading = signal<boolean>(false);

  constructor() {}

  async searchResident(query: string): Promise<void> {
    this.isLoading.set(true); // Set loading to true
    try {
      const response = await fetch(`https://residentcare-api.pepea.net/api/v1/resident/search/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.searchResults.set(data); // Update search results signal
      } else {
        console.error('Search failed:', response.statusText);
        this.searchResults.set([]); // Clear results on failure
      }
    } catch (error) {
      console.error('Error during search:', error);
      this.searchResults.set([]); // Clear results on error
    } finally {
      this.isLoading.set(false); // Set loading to false
    }
  }
}