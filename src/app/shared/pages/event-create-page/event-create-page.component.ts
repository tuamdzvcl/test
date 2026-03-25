import { Component } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-create-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BreadcrumbModule],
  templateUrl: './event-create-page.component.html',
  styleUrl: './event-create-page.component.scss',
})
export class EventCreatePageComponent {
  item: any;
  steps = [{ label: 'Chi Tiết' }, { label: 'Vé' }, { label: 'Cài Đặt' }];
  activeIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.item = [
      { label: 'Home' },
      { label: 'Create' },
      { label: 'Create Event' },
    ];

    this.setActiveIndexFromRoute();
  }

  private setActiveIndexFromRoute() {
    const url = this.router.url;

    if (url.includes('create-type')) {
      this.activeIndex = 1;
    } else if (url.includes('create-setting')) {
      this.activeIndex = 2;
    } else {
      this.activeIndex = 0;
    }
  }


  onNextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;

      if (this.activeIndex === 1) {
        this.router.navigate(['create-type'], { relativeTo: this.route });
      } else if (this.activeIndex === 2) {
        this.router.navigate(['create-setting'], {
          relativeTo: this.route,
        });
      }
    }
  }

  onStepClick(index: number) {
    this.activeIndex = index;

    if (index === 0) {
      this.router.navigate(['./'], { relativeTo: this.route });
    } else if (index === 1) {
      this.router.navigate(['create-type'], { relativeTo: this.route });
    } else if (index === 2) {
      this.router.navigate(['create-setting'], { relativeTo: this.route });
    }
  }
}
