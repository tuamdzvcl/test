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
import {
  FileSelectEvent,
  FileUploadEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';

import { MessageService } from 'primeng/api';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { Select, SelectModule } from 'primeng/select';
import { CatetoryService } from '../../../core/services/catetory.service';
import { EventService } from '../../../core/services/event.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

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
    ImageUrlPipe,
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
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;

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
    this.isEdit = !!this.eventId;

    this.loadCategories(() => {
      if (this.eventId) {
        this.loadEventData();
      }
    });
  }

  private loadCategories(callback?: () => void) {
    this.categoryService.GetCatetory().subscribe({
      next: (res: any) => {
        this.categories = res.Data || [];

        if (callback) {
          callback();
        }
      },
      error: (err: any) => {
        console.error('Failed to load categories:', err);
        this.categories = [];
      },
    });
  }

  private loadEventData() {
    if (!this.eventId) return;

    this.eventService.GetEventId(this.eventId).subscribe({
      next: (eventData: any) => {
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

  private populateForm() {
    if (!this.eventData) return;

    this.value = this.eventData.Title || '';
    this.text = this.eventData.Description || '';
    this.eventDate = new Date(this.eventData.StartDate);
    this.eventTime = new Date(this.eventData.StartDate);
    this.duration = this.calculateDuration(
      this.eventData.StartDate,
      this.eventData.EndDate
    );
    this.location = this.eventData.Location || '';

    const matchedCategory = this.categories.find(
      (c) => c.Name === this.eventData.CatetoryName
    );

    this.selectedCategory = matchedCategory ? matchedCategory.CatetoryId : null;
    this.imagePreviewUrl = this.resolveImageUrl(this.eventData);
  }

  private resolveImageUrl(data: any): string | null {
    return data?.PosterUrl || null;
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
  onSelectImage(event: any) {
    const file = event.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
