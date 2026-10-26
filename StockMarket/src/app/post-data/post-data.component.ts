import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stock } from '../model/stock';
import { HttpService } from '../services/http-service';

@Component({
  selector: 'app-post-data',
  imports: [FormsModule],
  templateUrl: './post-data.component.html',
  styleUrl: './post-data.component.css',
})
export class PostDataComponent {
  stock: Stock = { name: '', code: '', price: 0, previousPrice: 0, exchange: 'NYSE', favorite: false };

  message = '';
  success = false;
  saving = false;

  constructor(private httpService: HttpService) {}

  submitStock() {
    this.saving = true;

    this.httpService.postStock(this.stock).subscribe({
      next: (created) => {
        this.saving = false;
        this.success = true;
        this.message = `Đã tạo "${created.name}" — id server cấp: ${created.id}`;

        this.stock = { name: '', code: '', price: 0, previousPrice: 0, exchange: 'NYSE', favorite: false };
      },
      error: (err) => {
        this.saving = false;
        this.success = false;
        this.message = 'Tạo thất bại — hãy chắc json-server đang chạy.';
        console.log(err);
      },
    });
  }
}
