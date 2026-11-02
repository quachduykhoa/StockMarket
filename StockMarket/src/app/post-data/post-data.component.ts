import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stock } from '../model/stock';
import { HttpService } from '../services/http-service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-post-data',
  imports: [FormsModule],
  templateUrl: './post-data.component.html',
  styleUrl: './post-data.component.css',
})
export class PostDataComponent {
  stock: Stock = { name: '', code: '', price: 0, previousPrice: 0, exchange: 'NYSE', favorite: false };

  saving = false;

  constructor(private httpService: HttpService, private messageService: MessageService) {}

  submitStock() {
    this.saving = true;

    this.httpService.postStock(this.stock).subscribe({
      next: (created) => {
        this.saving = false;
        this.messageService.success(`Đã tạo "${created.name}" — id server cấp: ${created.id}`);

        this.stock = { name: '', code: '', price: 0, previousPrice: 0, exchange: 'NYSE', favorite: false };
      },
      error: (err) => {
        this.saving = false;
        this.messageService.error('Tạo thất bại — hãy chắc json-server đang chạy.');
        console.log(err);
      },
    });
  }
}
