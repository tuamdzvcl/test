import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,UserDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
