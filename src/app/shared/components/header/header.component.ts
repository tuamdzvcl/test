import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { CreateEventComponent } from '../../pages/create-event/create-event.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,UserDropdownComponent,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
