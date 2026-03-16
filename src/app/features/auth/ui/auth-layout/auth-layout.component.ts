import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
  @Input({ required: true }) topText!: string;
  @Input({ required: true }) topLinkText!: string;
  @Input({ required: true }) topLinkTo!: string | any[];

  @Input({ required: true }) title!: string;
}

