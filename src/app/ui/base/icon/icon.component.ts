import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Download,
  Lock,
  LucideAngularModule,
  Minus,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Smile,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Users
} from 'lucide-angular';

const DPO_ICONS = {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Download,
  Lock,
  Minus,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Smile,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Users
};

@NgModule({
  imports: [LucideAngularModule.pick(DPO_ICONS)],
  exports: [LucideAngularModule]
})
export class IconRegistryModule {}

@Component({
  selector: 'dpo-icon',
  standalone: true,
  imports: [CommonModule, IconRegistryModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() name = 'calendar';
  @Input() size = 16;
  @Input() dataCy = 'icon';
}
