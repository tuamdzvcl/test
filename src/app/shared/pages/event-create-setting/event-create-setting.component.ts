import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-create-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-create-setting.component.html',
  styleUrl: './event-create-setting.component.scss',
})
export class EventCreateSettingComponent {
  isImmediate: boolean = true;
}
