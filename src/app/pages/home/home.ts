import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  events: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.listEvents().subscribe(list => this.events = list as any[]);
  }

}
