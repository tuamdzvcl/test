import { Component, inject, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

// PrimeNG UI components
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

// Services của app
import { CatetoryService } from '../../../core/services/catetory.service';
import { EventService } from '../../../core/services/event.service';
import { EventDraftService } from '../../../core/services/event-draft.service';

// Biến môi trường (chứa apiBaseUrl)
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-venue-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    EditorModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent implements OnInit, OnDestroy {

  // ─── Inject các service cần dùng ───────────────────────────────────────────
  private route = inject(ActivatedRoute);   // đọc param trên URL
  private router = inject(Router);           // điều hướng trang
  private messageService = inject(MessageService);   // hiển thị toast thông báo
  private categoryService = inject(CatetoryService); // API danh mục
  private eventService = inject(EventService);     // API sự kiện
  private draftService = inject(EventDraftService);// lưu tạm dữ liệu form

  // ─── Truy cập phần tử DOM (input file ẩn) ──────────────────────────────────
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ─── Dữ liệu hiển thị trên form ────────────────────────────────────────────
  title: string = '';            // tên sự kiện
  description: string = '';            // mô tả
  location: string = '';            // địa điểm
  eventDate: Date | undefined;         // ngày diễn ra
  eventTime: Date | undefined;         // giờ diễn ra
  duration: number = 1;             // khoảng thời gian (giờ)

  // Danh mục
  categories: any[] = [];           // danh sách danh mục từ API
  selectedCategory: any = null;        // danh mục được chọn

  // Ảnh banner
  selectedFile: File | null = null;   // file ảnh người dùng chọn
  previewUrl: string | null = null;   // URL hiển thị ảnh preview

  // Danh sách lựa chọn khoảng thời gian
  durations = [
    { label: '1 giờ', value: 1 },
    { label: '2 giờ', value: 2 },
  ];

  // ─── Biến nội bộ ───────────────────────────────────────────────────────────
  private eventId: string | null = null; // lấy từ URL (chỉ có khi chỉnh sửa)
  private eventData: any = null;         // dữ liệu sự kiện gốc (mode edit)
  isEdit: boolean = false;               // true = đang chỉnh sửa, false = tạo mới

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE HOOKS
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    // Luôn tải danh sách danh mục để hiển thị dropdown
    this.loadCategories();

    // Luôn khôi phục dữ liệu từ DraftService
    // (Bên ngoài component cha đã lo việc nạp dữ liệu từ API vào Draft nếu là mode Edit)
    this.restoreFromDraft();

    // Xác định mode Edit dựa trên việc có dữ liệu trong draft hay không
    // Hoặc bạn có thể giữ biến eventId từ route nếu cần dùng cho mục đích khác
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.eventId;
  }

  ngOnDestroy(): void {
    // Khi rời khỏi trang tạo mới → lưu dữ liệu form vào draft để khôi phục sau
    if (!this.isEdit) {
      this.saveFormToDraft();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GỌI API
  // ═══════════════════════════════════════════════════════════════════════════

  /** Load danh sách danh mục từ API */
  private loadCategories(): void {
    this.categoryService.GetCatetory().subscribe({
      next: (res: any) => {
        this.categories = res.Data || [];
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // XỬ LÝ DRAFT (lưu/khôi phục dữ liệu khi navigate)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lưu toàn bộ dữ liệu form vào DraftService */
  private saveFormToDraft(): void {
    this.draftService.save(
      {
        title: this.title,
        description: this.description,
        location: this.location,
        selectedCategory: this.selectedCategory,
        eventDate: this.eventDate,
        eventTime: this.eventTime,
        duration: this.duration,
        previewUrl: this.previewUrl,
        tickets: this.draftService.load().tickets || [],
      },
      this.selectedFile,
    );
  }

  /** Khôi phục dữ liệu form từ DraftService (nếu có) */
  private restoreFromDraft(): void {
    if (!this.draftService.hasDraft()) return;

    const draft = this.draftService.load();
    this.title = draft.title;
    this.description = draft.description;
    this.location = draft.location;
    this.selectedCategory = draft.selectedCategory;
    this.eventDate = draft.eventDate ? new Date(draft.eventDate) : undefined;
    this.eventTime = draft.eventTime ? new Date(draft.eventTime) : undefined;
    this.duration = draft.duration;
    this.previewUrl = draft.previewUrl;
    this.selectedFile = this.draftService.selectedFile;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ĐIỀN DỮ LIỆU VÀO FORM (mode chỉnh sửa)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Đổ dữ liệu từ API vào các biến trên form */
  private fillFormFromEventData(): void {
    if (!this.eventData) return;

    this.title = this.eventData.Title || '';
    this.description = this.eventData.Description || '';
    this.location = this.eventData.Location || '';
    this.eventDate = new Date(this.eventData.StartDate);
    this.eventTime = new Date(this.eventData.StartDate);
    this.duration = this.calcDurationHours(this.eventData.StartDate, this.eventData.EndDate);

    // Tìm danh mục tương ứng trong danh sách và chọn nó
    const matched = this.categories.find(c => c.Name === this.eventData.CatetoryName);
    this.selectedCategory = matched ? matched.CatetoryId : null;

    // Hiển thị ảnh banner từ URL backend trả về
    // Backend lưu dạng tương đối: /images/xxx.jpg → cần ghép origin
    if (this.eventData.PosterUrl) {
      const serverOrigin = environment.apiBaseUrl.replace('/api', ''); // http://localhost:5083
      const posterPath = this.eventData.PosterUrl;
      this.previewUrl = posterPath.startsWith('http')
        ? posterPath
        : `${serverOrigin}${posterPath}`;
    }

    // --- Mới: Đồng bộ danh sách vé từ Backend ---
    if (this.eventData.ListTypeTick && Array.isArray(this.eventData.ListTypeTick)) {
      const mappedTickets = this.eventData.ListTypeTick.map((t: any) => ({
        id: t.Id,
        name: t.Name,
        price: t.Price,
        quantity: t.TotalQuantity,
        limit: 1,      // Fix cứng theo yêu cầu
        discount: 0,   // Fix cứng theo yêu cầu
        active: t.Status?.toLowerCase() === 'active',
        date: new Date(this.eventData.StartDate).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })
      }));

      // Lưu vào draft để bước sau có thể lấy ra dùng
      this.draftService.save({ tickets: mappedTickets });
    }

    // --- Mới: Đồng bộ cài đặt thời gian bán vé từ Backend ---
    const now = new Date();
    const sStart = this.eventData.SaleStartDate ? new Date(this.eventData.SaleStartDate) : null;
    const sEnd   = this.eventData.SaleEndDate   ? new Date(this.eventData.SaleEndDate)   : null;

    if (sStart) {
      const isPastOrPresent = sStart.getTime() <= now.getTime();
      this.draftService.save({
        isImmediateStart: isPastOrPresent,
        saleStartDate:    sStart.toISOString().split('T')[0],
        saleStartTime:    sStart.toTimeString().substring(0, 5),
      });
    }

    if (sEnd) {
      this.draftService.save({
        isAutoEnd:   true, // Có giá trị EndDate từ API thì coi như là tự động đóng
        saleEndDate: sEnd.toISOString().split('T')[0],
        saleEndTime: sEnd.toTimeString().substring(0, 5),
      });
    }
  }

  /** Tính khoảng thời gian giữa 2 mốc (đơn vị: giờ) */
  private calcDurationHours(startDate: string, endDate: string): number {
    const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // XỬ LÝ ẢNH
  // ═══════════════════════════════════════════════════════════════════════════

  /** Kích hoạt input[type=file] ẩn khi user nhấn nút hoặc click vào vùng ảnh */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  /** Khi người dùng chọn file → lưu file và tạo URL preview */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    // Dùng FileReader để đọc file thành Data URL và hiển thị preview ngay
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LƯU SỰ KIỆN
  // ═══════════════════════════════════════════════════════════════════════════

  saveEvent(): void {
    // Kiểm tra các trường bắt buộc
    if (!this.title || !this.selectedCategory || !this.eventDate || !this.location) {
      this.showToast('warn', 'Cảnh báo', 'Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    // Tính StartDate = eventDate + eventTime
    const startDate = new Date(this.eventDate!);
    if (this.eventTime) {
      startDate.setHours(this.eventTime.getHours(), this.eventTime.getMinutes());
    }

    // Tính EndDate = StartDate + duration (giờ)
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + this.duration);

    // Tên danh mục (backend nhận tên, không nhận id)
    const matchedCategory = this.categories.find(c => c.CatetoryId === this.selectedCategory);
    const categoryName = matchedCategory ? matchedCategory.Name : '';

    // Tạo FormData để gửi cả file ảnh lẫn dữ liệu text
    const formData = new FormData();
    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('Location', this.location);
    formData.append('CatetoryName', categoryName);
    formData.append('StartDate', startDate.toISOString());
    formData.append('EndDate', endDate.toISOString());
    formData.append('SaleStartDate', startDate.toISOString());
    formData.append('SaleEndDate', endDate.toISOString());
    if (this.selectedFile) {
      formData.append('PosterUrl', this.selectedFile);
    }

    // Gọi API tạo sự kiện mới
    this.eventService.CreateEvent(formData).subscribe({
      next: () => {
        this.draftService.clear(); // xóa draft sau khi tạo thành công
        this.showToast('success', 'Thành công', 'Sự kiện đã được tạo thành công!');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err: any) => {
        console.error('Create event error:', err);
        this.showToast('error', 'Lỗi', 'Không thể tạo sự kiện, vui lòng thử lại');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HỦY / RESET FORM
  // ═══════════════════════════════════════════════════════════════════════════

  cancel(): void {
    // Xóa draft và reset toàn bộ form về trạng thái ban đầu
    this.draftService.clear();
    this.title = '';
    this.description = '';
    this.location = '';
    this.selectedCategory = null;
    this.eventDate = undefined;
    this.eventTime = undefined;
    this.duration = 1;
    this.previewUrl = null;
    this.selectedFile = null;

    this.showToast('info', 'Đã xóa', 'Đã xóa toàn bộ dữ liệu form');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIỆN ÍCH
  // ═══════════════════════════════════════════════════════════════════════════

  /** Helper gọi toast nhanh, tránh lặp code */
  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
