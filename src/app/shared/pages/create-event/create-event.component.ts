// create-venue-event.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';

import { MainLayoutComponent } from '../../../layouts/main-layout/main-layout.component';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';


import { MenuItem, MessageService } from 'primeng/api';
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
    InputNumberModule 
    ,CommonModule,
    MainLayoutComponent,
    AutoCompleteModule,
    BreadcrumbModule,ButtonModule,
    ToastModule,
    FileUploadModule,
    EditorModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})

export class CreateEventComponent  {
      private messageService = inject(MessageService);

   items: any[] = [];
    value: any;

    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }
    
     text: string | undefined;

  steps = [
  { label: 'Chi Tiết' },
  { label: 'Vé' },
  { label: 'Cài Đặt' }
];

activeIndex = 0;

categories = [
  { label: 'Hội thảo', value: 'workshop' },
  { label: 'Âm nhạc', value: 'music' }
];

durations = [
  { label: '1 giờ', value: 1 },
  { label: '2 giờ', value: 2 }
];

  eventDate: Date | undefined;
  eventTime: Date | undefined;

  duration = 1;
   item: MenuItem[] | undefined | undefined;
    home: MenuItem | undefined;
    onBasicUploadAuto(event: UploadEvent) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
    }    ngOnInit() {
        this.item = [{label:'Home'},{ label: 'Create' }, { label: 'Create Event' }];
        
    }
    onUpload(event: FileUploadEvent) {
  this.messageService.add({
    severity: 'success',
    summary: 'Upload thành công',
    detail: 'File đã được upload'
  });
}

}