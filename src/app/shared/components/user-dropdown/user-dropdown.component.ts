import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { DashboardComponent } from '../../../features/dashboard/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule,
  DashboardComponent,RouterLink],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss'
})
export class UserDropdownComponent {
 isOpen = false;
  
 toggleDropdown(){
  console.log("test")
  this.isOpen=!this.isOpen
 }
 @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {

    const target = event.target as HTMLElement

    if (!target.closest('.user')) {
      this.isOpen = false
    }

  }
}
