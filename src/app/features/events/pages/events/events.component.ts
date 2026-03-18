import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppShellComponent } from '../../../../layouts/app-shell/app-shell.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, AppShellComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent {}

