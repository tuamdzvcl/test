import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EventModel } from '../model/event.model'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  getEvents(): Observable<EventModel[]> {
    return of([
      {
        id: 1,
        title: 'Music Festival',
        image: 'http://localhost:4200/cat.jpg',
        date: '20 May 2026',
        location: 'Hanoi'
      },
      {
        id: 2,
        title: 'Art Workshop',
        image: 'http://localhost:4200/cat.jpg',
        date: '22 May 2026',
        location: 'Da Nang'
      },
      {
        id: 3,
        title: 'Dance Competition',
        image: 'http://localhost:4200/cat.jpg',
        date: '25 May 2026',
        location: 'HCM City'
      },
      {
        id: 4,
        title: 'Dance Competition',
        image: 'http://localhost:4200/cat.jpg',
        date: '25 May 2026',
        location: 'HCM City'
      },
      {
        id: 5,
        title: 'Dance Competition',
        image: 'http://localhost:4200/cat.jpg',
        date: '25 May 2026',
        location: 'HCM City'
      },
      {
        id: 5,
        title: 'Dance Competition',
        image: 'http://localhost:4200/cat.jpg',
        date: '25 May 2026',
        location: 'HCM City'
      }
      ,{
        id: 6,
        title: 'Dance Competition',
        image: 'http://localhost:4200/cat.jpg',
        date: '25 May 2026',
        location: 'HCM City'
      }
    ])
  }
}