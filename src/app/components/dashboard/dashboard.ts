import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CryptoService } from '../../services/crypto.service';
import { Crypto, CryptoFilter } from '../../models/crypto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  username: string = '';
  cryptos: Crypto[] = [];
  loading: boolean = false;
  syncing: boolean = false;

  // Paginación
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  // Filtros
  searchTerm: string = '';
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minMarketCap: number | undefined;
  maxMarketCap: number | undefined;
  showFilters: boolean = false;
  useAdvancedFilters: boolean = false;

  // Valores formateados para los inputs
  minPriceDisplay: string = '';
  maxPriceDisplay: string = '';
  minMarketCapDisplay: string = '';
  maxMarketCapDisplay: string = '';

  // Alertas
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private authService: AuthService,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.username = user || '';
    });
    this.loadCryptos();
  }

  loadCryptos(): void {
    this.loading = true;

    // Si se activaron filtros avanzados, usar endpoint de filter
    if (this.useAdvancedFilters) {
      this.cryptoService
        .filterCryptos({
          query: this.searchTerm || undefined,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          minMarketCap: this.minMarketCap,
          maxMarketCap: this.maxMarketCap,
          page: this.currentPage,
          size: this.pageSize,
          sortBy: this.sortBy,
          direction: this.sortDirection,
        })
        .subscribe({
          next: (response) => {
            this.cryptos = response.content;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error filtering cryptos', error);
            this.showAlertMessage(
              'Error al filtrar criptomonedas: ' + (error.error?.message || error.message),
              'error'
            );
            this.loading = false;
          },
        });
    } else if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Si hay búsqueda simple, usar endpoint de search
      this.cryptoService.searchCryptos(this.searchTerm, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.cryptos = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching cryptos', error);
          this.showAlertMessage(
            'Error al buscar criptomonedas: ' + (error.error?.message || error.message),
            'error'
          );
          this.loading = false;
        },
      });
    } else {
      // Si no hay filtros ni búsqueda, usar endpoint de list con ordenamiento
      const filter: CryptoFilter = {
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
      };

      this.cryptoService.getCryptos(this.currentPage, this.pageSize, filter).subscribe({
        next: (response) => {
          this.cryptos = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading cryptos', error);
          this.showAlertMessage(
            'Error al cargar criptomonedas: ' + (error.error?.message || error.message),
            'error'
          );
          this.loading = false;
        },
      });
    }
  }

  onSearch(): void {
    this.currentPage = 0;
    this.useAdvancedFilters = false; // Búsqueda simple
    this.loadCryptos();
  }

  onApplyFilters(): void {
    this.currentPage = 0;
    this.useAdvancedFilters = true; // Activar filtros avanzados
    this.loadCryptos();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.minMarketCap = undefined;
    this.maxMarketCap = undefined;
    this.minPriceDisplay = '';
    this.maxPriceDisplay = '';
    this.minMarketCapDisplay = '';
    this.maxMarketCapDisplay = '';
    this.currentPage = 0;
    this.useAdvancedFilters = false;
    this.loadCryptos();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.loadCryptos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCryptos();
  }

  onSync(): void {
    this.syncing = true;
    this.showAlertMessage('Sincronizando datos desde el servicio externo...', 'info');
    this.cryptoService.syncCryptos().subscribe({
      next: (response) => {
        this.syncing = false;
        this.showAlertMessage(
          '✅ Datos sincronizados exitosamente. Se cargaron las criptomonedas.',
          'success'
        );
        this.loadCryptos();
      },
      error: (error) => {
        console.error('Error syncing cryptos', error);
        this.syncing = false;
        this.showAlertMessage(
          '❌ Error al sincronizar: ' + (error.error?.message || error.message),
          'error'
        );
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  formatNumber(value: string): string {
    // Permitir números y punto decimal
    const num = value.replace(/[^\d.]/g, '');
    if (!num) return '';

    // Si tiene punto decimal, no formatear para permitir escribir decimales
    if (num.includes('.')) {
      return num;
    }

    // Si es un número entero, formatear con comas
    return parseInt(num).toLocaleString('en-US');
  }

  onMinPriceChange(value: string): void {
    this.minPriceDisplay = this.formatNumber(value);
    const num = value.replace(/[^\d.]/g, '');
    this.minPrice = num ? parseFloat(num) : undefined;
  }

  onMaxPriceChange(value: string): void {
    this.maxPriceDisplay = this.formatNumber(value);
    const num = value.replace(/[^\d.]/g, '');
    this.maxPrice = num ? parseFloat(num) : undefined;
  }

  onMinMarketCapChange(value: string): void {
    this.minMarketCapDisplay = this.formatNumber(value);
    const num = value.replace(/[^\d.]/g, '');
    this.minMarketCap = num ? parseFloat(num) : undefined;
  }

  onMaxMarketCapChange(value: string): void {
    this.maxMarketCapDisplay = this.formatNumber(value);
    const num = value.replace(/[^\d.]/g, '');
    this.maxMarketCap = num ? parseFloat(num) : undefined;
  }

  showAlertMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Auto-cerrar después de 5 segundos (solo para success e info)
    if (type !== 'error') {
      setTimeout(() => {
        this.closeAlert();
      }, 5000);
    }
  }

  closeAlert(): void {
    this.showAlert = false;
  }
}
