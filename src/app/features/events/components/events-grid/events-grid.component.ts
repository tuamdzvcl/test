import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventService } from '../../../../core/services/event.service';
import { EventModel } from '../../../../core/model/event.model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-events-grid',
  standalone: true,
  imports: [CommonModule,
  EventCardComponent   ],
  templateUrl: './events-grid.component.html',
  styleUrl: './events-grid.component.scss'
})
export class EventsGridComponent {
events: EventModel[] = []

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(data => {
      this.events=data
      console.log(data)
    })
  }
}
