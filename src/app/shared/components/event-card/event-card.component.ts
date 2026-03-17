import { Component, Input } from '@angular/core';
import { EventModel } from '../../../core/model/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
@Input() eventmodel!: EventModel

}
