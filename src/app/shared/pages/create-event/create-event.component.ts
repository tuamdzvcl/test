// create-venue-event.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';

import { MessageService } from 'primeng/api';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { Select, SelectModule } from 'primeng/select';
import { CatetoryService } from '../../../core/services/catetory.service';
import { EventService } from '../../../core/services/event.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-create-venue-event',
  standalone: true,
  imports: [
    FormsModule,
    StepsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    CommonModule,
    ButtonModule,
    ToastModule,
    FileUploadModule,
    EditorModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent {
  eventData: any = null;
  isEdit: boolean = false;
  categories: any[] = [];
  eventId: string | null = null;
  selectedCategory: any = null;
  location: string = '';
  value: any;
  text: string | undefined;
  eventDate: Date | undefined;
  eventTime: Date | undefined;
  duration: number = 1;

  durations = [
    { label: '1 giờ', value: 1 },
    { label: '2 giờ', value: 2 },
  ];

  constructor(
    private router: ActivatedRoute,
    private messageService: MessageService = inject(MessageService),
    private categoryService: CatetoryService = inject(CatetoryService),
    private eventService: EventService = inject(EventService),
    private routerNavigate: Router = inject(Router)
  ) {}

  ngOnInit() {
    this.eventId = this.router.snapshot.paramMap.get('id');

    if (this.eventId) {
      this.loadEventData();
    }
  }

  private loadEventData() {
    if (!this.eventId) return;
    this.eventService.GetEventId(this.eventId).subscribe({
      next: (eventData: any) => {
        console.log('Event data loaded:', eventData);
        this.eventData = eventData;
        this.populateForm();
      },
      error: (err: any) => {
        console.error('Failed to load event data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu sự kiện',
        });
      },
    });
  }
  private loadCategories() {
    this.categoryService.GetCatetory().subscribe({
      next: (res: any) => {
        this.categories = res.Data || [];
      },
      error: (err: any) => {
        console.error('Failed to load categories:', err);
        this.categories = [];
      },
    });
  }

  private populateForm() {
    if (!this.eventData) return;

    console.log('Populating form with data:', this.eventData);

    this.value = this.eventData.Title || '';
    this.text = this.eventData.Description || '';
    this.eventDate = new Date(this.eventData.StartDate);
    this.eventTime = new Date(this.eventData.StartDate);
    this.duration = this.calculateDuration(
      this.eventData.StartDate,
      this.eventData.EndDate
    );
    console.log('duration', this.duration);
    const matchedCategory = this.categories.find(
      (c) => c.Name === this.eventData.CatetoryName
    );

    this.selectedCategory = matchedCategory ? matchedCategory.CatetoryId : null;
    this.location = this.eventData.Location || '';
  }

  private calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  onUpload(event: FileUploadEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Upload thành công',
      detail: 'File đã được upload',
    });
  }

  saveEvent() {
    // Validate required fields
    if (
      !this.value ||
      !this.selectedCategory ||
      !this.eventDate ||
      !this.location
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc (*)',
      });
      return;
    }

    const startDate = new Date(this.eventDate!);
    if (this.eventTime) {
      const time = new Date(this.eventTime);
      startDate.setHours(time.getHours());
      startDate.setMinutes(time.getMinutes());
    }

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + this.duration);

    const eventData = {
      Title: this.value,
      Description: this.text || '',
      CategoryId: this.selectedCategory,
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      Location: this.location,
    };

    if (this.isEdit) {
      // Update existing event
      console.log('Updating event:', { ...eventData, Id: this.eventId });
      this.messageService.add({
        severity: 'info',
        summary: 'Đang cập nhật',
        detail: 'Sự kiện đang được cập nhật...',
      });
    } else {
      // Create new event
      console.log('Creating new event:', eventData);
      this.messageService.add({
        severity: 'info',
        summary: 'Đang tạo',
        detail: 'Sự kiện mới đang được tạo...',
      });
    }
  }

  cancel() {
    if (this.isEdit) {
      // Navigate back to events list
      this.routerNavigate.navigate(['/events']);
    } else {
      // Clear form
      this.value = '';
      this.text = '';
      this.selectedCategory = null;
      this.eventDate = undefined;
      this.eventTime = undefined;
      this.duration = 1;
      this.location = '';

      this.messageService.add({
        severity: 'info',
        summary: 'Đã xóa',
        detail: 'Đã xóa dữ liệu form',
      });
    }
  }
}
