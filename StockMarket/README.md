# Bài thực hành số 7 — Making HTTP Calls in Angular (HttpClient + JSON Server)

> **Project:** `StockMarket` — Angular **21.2.24** (standalone components, SSR, zoneless mặc định)
> **Tài liệu này:** giải thích **điều gì đã thay đổi so với Bài 6**, **dòng chảy dữ liệu (flow) từng bước** và **mỗi đoạn code nằm ở file nào — làm gì, cần gì, gọi ai**.

---

## 1. Đề bài yêu cầu gì ↔ Đã làm ở đâu

| # | Yêu cầu (Bài thực hành số 7) | Nơi thực hiện |
|---|---|---|
| 1 | Giả lập API bằng JSON Server (`data.json`, `json-server --watch data.json`) | `data.json` (gốc project) + terminal chạy json-server cổng **3000** |
| 2 | Lớp `httpService` đọc dữ liệu từ API | `src/app/services/http-service.ts` (class `HttpService`, 6 method REST) |
| 3 | **Get** component | `src/app/get-data/get-data.component.*` + route `/get-data` |
| 4 | **Post** component | `src/app/post-data/post-data.component.*` + route `/post-data` |
| 5 | Thêm `update/delete/get...` trong httpService và **dùng httpService cho hiển thị / thêm / xóa / sửa / tìm kiếm**, đổi gì ghi vào `data.json` | `stock-list` (GET/POST/PATCH/DELETE), `stock-update-dialog` (PUT), `create-stock-form` (POST) — xem **Mục 4** |

---

## 2. Bài 6 → Bài 7: những gì đã THAY ĐỔI

### 2.1 Bảng so sánh

| Khía cạnh | **Bài 6** (Services + Observable) | **Bài 7** (HTTP Calls) |
|---|---|---|
| Nguồn dữ liệu | `StockService` — **mảng trong bộ nhớ**, mỗi lần khởi động app là **mất dữ liệu đã thêm** | **json-server** — dữ liệu nằm trong **`data.json`**, ghi **vĩnh viễn** |
| Cơ chế trả dữ liệu | `of(this.stocks)` — Observable **phát ngay, đồng bộ** | `http.get(...)` — Observable **phát khi server trả lời, bất đồng bộ** |
| Giao thức | Không có — chỉ hàm TS gọi hàm TS | **REST**: `GET / POST / PUT / PATCH / DELETE` trên `/stocks`, `/stocks/{id}` |
| Service mới | `StockService` (`createStock`, `toggleFavorite`, `deleteStock`, `updateStock`) | **`HttpService`** (`getStocks`, `postStock`, `getStockById`, `updateStock`, `patchStock`, `deleteStock`) |
| Cấu hình DI | Không cần gì thêm | `app.config.ts`: **`provideHttpClient(withFetch())`** — bật `HttpClient` cho toàn app |
| Model `Stock` | Không có `id` (tìm theo `code`) | Thêm **`id?: string`** — khóa chính **do server cấp** |
| Truyền data con → cha | Form tự thao tác service | Form thêm **`@Output() stockCreated`** → cha (`StockList`) tự thêm vào bảng |
| Component mới | — | `GetDataComponent`, `PostDataComponent` + 2 route |
| Test | Mock `StockService` bằng dữ liệu thật trong bộ nhớ | Mock **`HttpService`** bằng "server giả" `createHttpServiceMock()` (có kho `store`, trả `of([...])`) |
| Change detection |以前 chạy được vì `of()` **đồng bộ** (gán biến ngay giữa lúc Angular đang vẽ) | **Phải bật `zone.js`** — nếu không: server trả 200 nhưng màn hình **đứng hình** (xem mục **7.5**) |

### 2.2 Tóm gọn 1 câu

> **Bài 6:** component ↔ service ↔ *mảng trong RAM*.
> **Bài 7:** component ↔ `HttpService` ↔ *HTTP* ↔ *json-server* ↔ **`data.json`** — và `StockService` của Bài 6 **giữ nguyên** (chỉ còn `stock.service.spec.ts` dùng để test riêng), **UI không còn dùng nữa**.

---

## 3. Sơ đồ kiến trúc

```
┌──────────────────────────── TRÌNH DUYỆT (client, Angular) ────────────────────────────┐
│                                                                                      │
│  main.ts → bootstrapApplication(App, appConfig)                                      │
│              └ app.config.ts  = "công tắc": provideHttpClient(withFetch()),           │
│                                   provideZoneChangeDetection(), provideRouter(...)    │
│                                                                                      │
│  app.routes.ts ──┬─ /login          → Login                                          │
│                  ├─ /stock-item     → StockList   ◄─ TRANG CHÍNH (CRUD đầy đủ)       │
│                  ├─ /create-stock   → CreateStock (demo form, chỉ console.log)        │
│                  ├─ /create-stock-form → CreateStockForm                             │
│                  ├─ /get-data       → GetDataComponent   ◄─ demo GET                  │
│                  └─ /post-data      → PostDataComponent  ◄─ demo POST                 │
│                                                                                      │
│  Component ──inject──► HttpService ──HTTP(fetch)──► http://localhost:3000/...          │
│       │                  (services/http-service.ts)                                  │
│       └──(chi trong test)──► StockService (Bài 6, in-memory, of()) ← KHÔNG UI dùng    │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │  GET/POST/PUT/PATCH/DELETE
                                       ▼
┌──────────────── json-server (cổng 3000, chạy bằng `json-server --watch data.json`) ───┐
│   GET    /stocks          → đọc danh sách                                            │
│   GET    /stocks/{id}     → đọc 1 bản ghi                                           │
│   POST   /stocks          → tạo mới (server tự sinh id 11 ký tự)                    │
│   PUT    /stocks/{id}     → thay thế TOÀN BỘ bản ghi                               │
│   PATCH  /stocks/{id}     → sửa MỘT PHẦN (vd: `{favorite: true}`)                   │
│   DELETE /stocks/{id}     → xóa                                                     │
│   ✍️ Mọi thao tác ghi (POST/PUT/PATCH/DELETE) đều được ghi ngay vào data.json        │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       ▼
                          📄 StockMarket/data.json
                          { "stocks": [ {id, name, code, price, ...} ],
                            "profile": {...},
                            "$schema": "..." }   ← json-server tự thêm dòng $schema
```

---

## 4. FLOW dữ liệu chi tiết — từng bước kèm CODE

### F0. Khởi động — ai đăng ký ai? (`src/app/app.config.ts`)

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),          // (1) chạy Change Detection bằng zone (xem 7.5)
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())         // (2) tạo singleton HttpClient cho toàn app
  ]
};
```

| Provider | Làm gì | Tại sao cần |
|---|---|---|
| `provideHttpClient(withFetch())` | **Tạo 1 `HttpClient` duy nhất** ở tầng DI gốc, dùng API `fetch` | Không có dòng này → `inject(HttpClient)` **throw** `NullInjectorError`. `withFetch()` để chạy được cả **trình duyệt lẫn Node (SSR)** — `XMLHttpRequest` không tồn tại ở Node |
| `provideZoneChangeDetection()` | Bật chế độ vẽ lại dựa trên **zone.js** | Angular 21 mặc định **zoneless** → response HTTP không tự kích hoạt vẽ lại → **phải F5** (xem 7.5) |
| `provideRouter(routes)` | Nạp bảng route ở Mục 3 | |
| `provideClientHydration(withEventReplay())` | Hydration cho SSR | Dự án có `main.server.ts` / `server.ts` |

**Sau khi đăng ký:** mọi component/service đều **inject được `HttpClient`** (và `HttpService` — vì nó `providedIn: 'root'`).

---

### F1. GET danh sách — trang chính `/stock-item`

**Chuỗi gọi (đọc theo mũi tên):**

```
Trình duyệt mở /stock-item
  → app.routes.ts khớp route { path:'stock-item', component: StockList }
    → Angular tạo StockList, chạy ngOnInit()
      → stock-list.ts:  this.httpService.getStocks().subscribe({ next, error })
        → http-service.ts:  httpClient.get<Stock[]>('http://localhost:3000/stocks')
          → json-server: đọc data.json → trả 200 + JSON mảng stocks
            → .pipe(map(data => data.map(s => this.toStock(s))))   ← "hồi sinh" object
              → next(stocks): this.stocks = stocks
                → Angular vẽ lại bảng  → @for (stock of filteredStocks) hiển thị dòng
```

**① `src/app/stock/stock-list/stock-list.ts` (component cha)**

```typescript
constructor(private httpService: HttpService) {}        // CẦN: HttpService (DI, providedIn root)

ngOnInit() {
  this.httpService.getStocks().subscribe({              // GỌI: HttpService.getStocks()
    next: (stocks) => (this.stocks = stocks),
    error: (err: Error) => console.log(err.message),    // server tắt → log, không crash
  });
}
```

**② `src/app/services/http-service.ts` (lớp dịch)**

```typescript
private REST_API_SERVER = 'http://localhost:3000';
httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

public getStocks(): Observable<Stock[]> {
  return this.httpClient                                 // CẦN: HttpClient (do app.config cung cấp)
    .get<Stock[]>(`${this.REST_API_SERVER}/stocks`)      // GỌI: GET /stocks
    .pipe(map((data) => data.map((s) => this.toStock(s))));
}
```

**③ `toStock()` — phần QUAN TRỌNG (chỗ này LỆCH docx có chủ ý)**

```typescript
private toStock(data: Stock): Stock {
  const stock = new Stock(data.name, data.code, data.price, data.previousPrice, data.exchange);
  stock.id = data.id;               // server cấp
  stock.favorite = data.favorite ?? false;
  return stock;
}
```

* **Vì sao cần:** server trả JSON → object **thường**, **không có method**. Nếu template gọi `stock.isPositiveChange()` → crash `is not a function`. `toStock` "hồi sinh" nó thành instance `Stock` thật.
* **Vì sao `id?: string`:** json-server v1 trả id **luôn là chuỗi** (`"1"` hoặc id random `"mH25RxnMqbI"` — sinh bằng `randomBytes(8).toString('base64url')`, 11 ký tự URL-safe).

**④ `stock-list.html` (hiển thị)**

```html
<ul class="stock-list">
  @for (stock of filteredStocks; track stock.id) {   <!-- track theo id (khóa REST) -->
    <li><app-stock-item [stock]="stock" ... /></li>
  }
</ul>
```

---

### F2. GET — component demo `GetDataComponent` (route `/get-data`)

| Thành phần | Nội dung |
|---|---|
| **File** | `src/app/get-data/get-data.component.ts` |
| **Làm gì** | Gọi API 1 lần khi mở trang, hiện bảng dữ liệu + cột **ID** |
| **Cần gì** | `HttpService` (inject), `Stock` (model) |
| **Gọi ai** | `httpService.getStocks()` → `GET /stocks` |

```typescript
export class GetDataComponent implements OnInit {
  stocks: Stock[] = [];  loading = true;  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getStocks().subscribe({
      next: (stocks) => { this.stocks = stocks; this.loading = false; },
      error: () => {                       // BẮT LỖI = bắt buộc (xem 7.6)
        this.errorMessage = 'Không kết nối được server. Hãy chạy "json-server --watch data.json"...';
        this.loading = false;
      },
    });
  }
}
```

---

### F3. POST — component demo `PostDataComponent` (route `/post-data`)

| Thành phần | Nội dung |
|---|---|
| **File** | `src/app/post-data/post-data.component.ts` |
| **Làm gì** | Form nhập 5 trường → tạo bản ghi mới trên server → hiện **id server cấp** → reset form |
| **Cần gì** | `FormsModule` (`[(ngModel)]`), `HttpService`, model `Stock` |
| **Gọi ai** | `httpService.postStock(stock)` → `POST /stocks` |

```typescript
stock: Stock = new Stock('', '', 0, 0, 'NYSE');   // model làm "khoôn" cho form

submitStock() {
  this.saving = true;
  this.httpService.postStock(this.stock).subscribe({     // GỌI: POST /stocks (body = JSON stock)
    next: (created) => {
      this.message = `Đã tạo "${created.name}" — id server cấp: ${created.id}`;
      this.stock = new Stock('', '', 0, 0, 'NYSE');      // reset form
    },
    error: () => { this.message = 'Tạo thất bại — hãy chắc json-server đang chạy.'; },
  });
}
```

> ⚠️ **Không** viết `JSON.stringify(stock)` như docx — `HttpClient` **đã tự** `JSON.stringify` body; stringify thêm 1 lần nữa là server nhận **chuỗi rỗng rỗng** → dữ liệu hỏng.

---

### F4. POST — form trong trang chính + truyền kết quả lên cha (con → cha)

Đây là chỗ **khác Bài 6 nhiều nhất**: form **không được đụng** `StockList.stocks` (data của cha) → phải **bắn sự kiện lên**.

**Luồng:**

```
Người dùng submit CreateStockForm
 → create-stock-form.ts: this.httpService.postStock(stock)     ← GỌI HttpService (POST /stocks)
   ← next(created)
     → this.stockCreated.emit(created)                          ← @Output BÁO CHA
       → stock-list.html:  (stockCreated)="onStockCreated($event)"
         → stock-list.ts:  onStockCreated(created) → this.stocks = [...this.stocks, created]
           → bảng hiện dòng mới NGAY (không cần F5)
```

**① `create-stock-form.ts`**

```typescript
@Output() stockCreated = new EventEmitter<Stock>();          // CẦN: @angular/core (EventEmitter, Output)

constructor(private fb: FormBuilder, private httpService: HttpService) { this.createForm(); }

onSubmit() {
  ...
  this.httpService.postStock(stock).subscribe({              // GỌI: HttpService.postStock → POST /stocks
    next: (created) => {
      this.message = 'Successfully created stock with stock code: ' + created.code;
      this.resetForm();
      this.stockCreated.emit(created);                       // ← báo cha
    },
    error: (err: Error) => { this.message = err.message; },
  });
}
```

**② `stock-list.html` (dòng 47)**

```html
<app-create-stock-form (stockCreated)="onStockCreated($event)" />
```

**③ `stock-list.ts`**

```typescript
onStockCreated(created: Stock) {
  this.stocks = [...this.stocks, created];    // mảng mới → an toàn, Angular dễ nhận ra thay đổi
}
```

> 🎓 **`@Input` (cha → con)** vs **`@Output` (con → cha)**: `[stock]="item"` đẩy dữ liệu xuống; `(stockCreated)="hàm"` đẩy **sự kiện** lên. Cha tự quyết định làm gì với nó.

---

### F5. PATCH — nút ⭐ Favorite (sửa MỘT phần)

```
Bấm ⭐ (stock-item)
 → (favoriteChange) → stock-list.toggleFavorite(stock)
   → httpService.patchStock(stock.id, { favorite: !stock.favorite })   ← PATCH /stocks/{id}
     → json-server: chỉ ghi trường favorite vào data.json
   ← next(updated) → stock.favorite = updated.favorite   → bảng đổi nhãn ngay
```

```typescript
toggleFavorite(stock: Stock) {
  this.httpService.patchStock(stock.id!, { favorite: !stock.favorite }).subscribe({
    next: (updated) => (stock.favorite = updated.favorite),
    error: (err: Error) => console.log(err.message),
  });
}
```

`stock.id!` — dám dùng `!` vì mọi stock hiển thị đều **đến từ server** (luôn có id).

---

### F6. PUT — dialog Sửa (`StockUpdateDialog`)

```
Bấm Sửa → StockList.openUpdate(stock) → stockToUpdate = stock
 → template:  @if (stockToUpdate) { <app-stock-update-dialog [stock]="stockToUpdate" ...> }
   → dialog ngOnChanges đổ dữ liệu cũ vào form
   → người dùng sửa → Save()
     → httpService.updateStock(stock.id!, updated)      ← PUT /stocks/{id} (gửi TOÀN BỘ)
       → json-server: thay thế cả bản ghi trong data.json
     ← next(saved) → Object.assign(this.stock, saved)   ← đồng bộ object ĐANG NẰM TRONG BÁNG
                 → this.close()
```

```typescript
const updated = new Stock(value.name ?? this.stock.name, this.stock.code,
                          Number(value.price ?? 0), Number(value.previousPrice ?? 0),
                          value.exchange ?? 'OTHER');

// ⚠️ PUT thay thế TOÀN BỘ bản ghi → thiếu trường là MẤT trường đó:
updated.id = this.stock.id;               // server cần biết sửa bản ghi nào
updated.favorite = this.stock.favorite;   // KHÔNG gửi = mất cờ ⭐

this.httpService.updateStock(this.stock.id!, updated).subscribe({
  next: (saved) => { Object.assign(this.stock, saved); this.close(); },
  error: (err: Error) => { this.message = err.message; this.messageType = 'error'; },
});
```

**PUT khác PATCH:**

| | `PUT` (dialog Sửa) | `PATCH` (nút ⭐) |
|---|---|---|
| Gửi lên | **CẢ bản ghi** — thiếu field = field đó **bị xóa** | **Chỉ field cần đổi** — còn lại giữ nguyên |
| Ví dụ body | `{name, code, price, previousPrice, exchange, favorite, id}` | `{favorite: true}` |

---

### F7. DELETE — nút Remove

```typescript
deleteStock(stock: Stock) {
  this.httpService.deleteStock(stock.id!).subscribe({     // DELETE /stocks/{id}
    next: () => {
      this.stocks = this.stocks.filter((each) => each.id !== stock.id); // server đã xóa file → chỉ loại khỏi mảng hiển thị
    },
    error: (err: Error) => console.log(err.message),
  });
}
```

Server trả **200 + object đã xóa** (đã đo thực tế), nếu id không tồn tại → **404** → vào `error`.

---

### F8. Tìm kiếm

Ô tìm kiếm dùng `[(ngModel)]="searchTerm"` → getter **`filteredStocks`** lọc **cục bộ** trên mảng đã tải qua `httpService.getStocks()`:

```typescript
get filteredStocks(): Stock[] {
  const term = this.searchTerm.trim().toLowerCase();
  if (!term) return this.stocks;
  return this.stocks.filter((each) =>
    each.name.toLowerCase().includes(term) ||
    each.code.toLowerCase().includes(term) ||
    each.exchange?.toLowerCase().includes(term));
}
```

> 📌 **Ghi chú:** json-server **v1** không còn hỗ trợ `?q=` (full-text) hay `?_like=`. Chỉ còn lọc **theo từng field**: `?code=SSC`, `?price_gte=50`, `?name_contains=stock` (**không phân biệt hoa thường** — xem `matches-where.js`). Muốn tìm **OR** name/code/exchange phía server phải bắn 3 request rồi gộp → với dữ liệu vài chục bản ghi thì lọc cục bộ nhanh và đơn giản hơn.

---

### F9. json-server ghi `data.json`

| Verb bạn gửi | json-server làm gì với file |
|---|---|
| `POST /stocks` | Thêm phần tử vào `stocks[]`, **sinh id mới** (11 ký tự base64url), ghi lại file |
| `PUT /stocks/{id}` | **Thay thế** cả phần tử đó |
| `PATCH /stocks/{id}` | Ghi đè **riêng** các trường trong body |
| `DELETE /stocks/{id}` | Xóa phần tử khỏi mảng |

* `data.json` viết tay: id `1,2,3,4` (số → server chuẩn hóa thành **chuỗi** `"1"`).
* Dòng `"$schema": "./node_modules/json-server/schema.json"` do **json-server tự thêm** khi lưu file → vô hại, đừng xóa (xóa cũng tự thêm lại).
* ⚠️ File phải là **UTF-8 không BOM** — có BOM là json-server crash (`Unexpected token`).

---

## 5. KHO FILE — file nào làm gì, cần gì, gọi ai

### 5.1 File MỚI của Bài 7

| File | Làm gì | Cần (import / inject) | Gọi ai |
|---|---|---|---|
| `data.json` | "Cơ sở dữ liệu" phẳng: `stocks[]` + `profile` | — | Được json-server đọc/ghi |
| `src/app/services/http-service.ts` | Lớp `HttpService` — **6 method REST** + `toStock()` | `HttpClient`, `HttpHeaders`, `map` (rxjs), `Stock` | `GET/POST/PUT/PATCH/DELETE localhost:3000` |
| `src/app/get-data/get-data.component.ts` | Demo **GET**: bảng dữ liệu + cột id + nhánh lỗi | `HttpService`, `Stock` | `httpService.getStocks()` |
| `src/app/post-data/post-data.component.ts` | Demo **POST**: form ngModel → tạo mới → hiện id | `FormsModule`, `HttpService`, `Stock` | `httpService.postStock()` |

### 5.2 File SỬA của Bài 7

| File | Thay đổi | Cần gì | Gọi ai |
|---|---|---|---|
| `src/app/app.config.ts` | Thêm `provideHttpClient(withFetch())` + `provideZoneChangeDetection()` | `@angular/common/http`, `@angular/core` | — (đăng ký cho DI) |
| `src/app/model/stock.ts` | Thêm **`id?: string`** (không thêm vào constructor → không phá `new Stock(...)` cũ) | — | — |
| `src/app/app.routes.ts` | Thêm route `/get-data`, `/post-data` (⚠️ **không quên dấu phẩy** giữa các phần tử mảng) | 2 component mới | Router |
| `src/app/stock/stock-list/stock-list.ts` | `StockService` → **`HttpService`**: `getStocks`, `patchStock` (⭐), `deleteStock`, thêm `onStockCreated` | `HttpService` | `HttpService` |
| `src/app/stock/stock-list/stock-list.html` | Gắn `(stockCreated)="onStockCreated($event)"` cho form con | — | `CreateStockForm` |
| `src/app/stock/stock-list/stock-list.spec.ts` | Thay mock: `createHttpServiceMock()` (kho `store` + trả `of([...store])`) + `providers` | `HttpService`, `of`, `Stock` | — (test kép, không mạng) |
| `src/app/stock/create-stock-form/create-stock-form.ts` | `StockService.createStock` → **`httpService.postStock`** + thêm **`@Output() stockCreated`** | `HttpService`, `EventEmitter` | `HttpService` → báo `StockList` |
| `src/app/stock/create-stock-form/create-stock-form.spec.ts` | Thêm `providers: [{ provide: HttpService, useValue: {...} }]` (bắt buộc — thiếu là `NullInjectorError`) | `HttpService` | — |
| `src/app/stock/stock-update-dialog/stock-update-dialog.ts` | `StockService.updateStock` → **`httpService.updateStock(id, updated)`** + giữ `id`/`favorite` + `Object.assign` đồng bộ | `HttpService` | `HttpService` |

### 5.3 File GIỮ NGUYÊN từ Bài 6

| File | Trạng thái |
|---|---|
| `src/app/services/stock.service.ts` | Giữ nguyên — **UI không còn dùng** |
| `src/app/services/stock.service.spec.ts` | Vẫn test riêng service Bài 6 |
| `stock-item`, `stock-detail-dialog`, `login`, `create-stock`, CSS... | Không đổi (trừ các dòng đã nêu ở trên) |

### 5.4 Test hiện có: **7 file / 10 test**

```
src/app/app.spec.ts                                    (2 test)
src/app/login/login.spec.ts                            (1)
src/app/model/stock.spec.ts                            (1)
src/app/services/stock.service.spec.ts                 (1)
src/app/stock/stock-item/stock-item.spec.ts            (1)
src/app/stock/stock-list/stock-list.spec.ts            (3)  ← mock HttpService
src/app/stock/create-stock-form/create-stock-form.spec.ts (1) ← provider HttpService
```

**Mock trong `stock-list.spec.ts` — "server giả" chạy trong bộ nhớ:**

```typescript
function createHttpServiceMock() {
  const store: Stock[] = [ /* 4 stock mẫu */, ].map((each, i) => { each.id = String(i + 1); return each; });
  return {
    getStocks: () => of([...store]),      // ⭐ trả BẢN SAO mảng (giống server trả JSON)
    postStock: (stock) => { stock.id = 'mock-' + (store.length + 1); store.push(stock); return of(stock); },
    patchStock: (id, changes) => { const f = store.find(s => s.id === id)!; Object.assign(f, changes); return of(f); },
    deleteStock: (id) => { const [r] = store.splice(store.findIndex(s => s.id === id), 1); return of(r); },
    ...
  };
}
// providers: [{ provide: HttpService, useValue: createHttpServiceMock() }]
```

> ⭐ **`getStocks` phải trả `[...store]` (mảng MỚI), không được trả `store`:** nếu trả đúng `store` thì `push` của form sẽ đếm 2 lần → assertion `toHaveLength(5)` fail.

---

## 6. Bảng ánh xạ REST ↔ code

| HTTP | URL | Method trong `HttpService` | Component gọi | Ghi `data.json` |
|---|---|---|---|---|
| `GET` | `/stocks` | `getStocks()` | `StockList.ngOnInit`, `GetDataComponent` | — |
| `GET` | `/stocks/{id}` | `getStockById(id)` | (sẵn sàng dùng) | — |
| `POST` | `/stocks` | `postStock(stock)` | `CreateStockForm.onSubmit`, `PostDataComponent` | ✅ thêm |
| `PUT` | `/stocks/{id}` | `updateStock(id, stock)` | `StockUpdateDialog.save` | ✅ thay thế |
| `PATCH` | `/stocks/{id}` | `patchStock(id, changes)` | `StockList.toggleFavorite` | ✅ vá 1 phần |
| `DELETE` | `/stocks/{id}` | `deleteStock(id)` | `StockList.deleteStock` | ✅ xóa |

---

## 7. BẪY ĐÃ GẶP & BÀI HỌC (rất nên đọc lại trước khi nộp)

### 7.1 `id` là **chuỗi** và có thể là **chuỗi random**
json-server v1 sinh id bằng `randomBytes(8).toString('base64url')` → 11 ký tự (vd `mH25RxnMqbI`), alphabet URL-safe (`A-Za-z0-9-_`) để ghép thẳng vào URL. → Model phải `id?: string`, **tuyệt đối không** `parseInt(id)` hay so `id > 5`.

### 7.2 JSON ≠ object có method → phải `map(toStock)`
Gọi `stock.isPositiveChange()` trên object nhận từ server sẽ crash nếu không "hồi sinh".

### 7.3 `PUT` gửi thiếu field = **mất field**
Đó là lý do `updated.favorite = this.stock.favorite` tồn tại. `PATCH` thì ngược lại — chỉ field trong body bị đổi.

### 7.4 Hai lỗi "im lặng" cực nguy hiểm
* **`JSON.stringify(stock)` khi POST** → server nhận chuỗi 2 lớp → dữ liệu hỏng.
* **Thiếu dấu `,` giữa 2 route** trong `app.routes.ts` → `ng test` vẫn **PASS** (test không compile file routes) nhưng `ng build` **FAIL** → **phải chạy CẢ `ng test` VÀ `ng build`**.

### 7.5 🔥 "Login xong không hiện dữ liệu, phải F5" — lỗi Change Detection (zoneless)

**Triệu chứng:** server trả `GET /stocks → 200` (dữ liệu về, nằm trong RAM) nhưng bảng vẫn "0 stocks"; gõ phím bất kỳ là dữ liệu **trồi ra ngay**; F5 thì thấy.

**Nguyên nhân:** Angular 21 tạo project mặc định **zoneless** (không có `zone.js`) → sau khi `subscribe` gán `this.stocks = stocks`, **không ai báo Angular vẽ lại**. Hồi Bài 6 không lộ vì `of()` **phát đồng bộ** ngay giữa lúc Angular đang vẽ.

**Cách sửa (đã áp,4 bước):**

```powershell
npm install zone.js
```

```jsonc
// angular.json → projects.StockMarket.architect.build.options  (thêm sau "tsConfig")
"polyfills": [ "zone.js" ],
```

```typescript
// app.config.ts
import { ..., provideZoneChangeDetection } from '@angular/core';
providers: [ ..., provideZoneChangeDetection(), ... ]
```

```typescript
// src/app/stock/stock-list/stock-list.spec.ts → trong beforeEach, SAU "await fixture.whenStable();"
fixture.detectChanges();   // (4) với zone, TestBed không còn tự vẽ lần đầu → phải ép tường minh
```

**Chứng minh:** chạy tự động hóa — login `khoa/123456` → **đứng yên 3 giây, không thao tác** → bảng hiện **"4 stocks"** (trước khi fix: "0 stocks").

### 7.6 SSR/prerender gọi thẳng API lúc `ng build`
Dự án prerender **7 route** trên Node. Nếu json-server đang tắt thì `/get-data` sẽ fail → **bắt buộc có nhánh `error` trong `subscribe`** để build vẫn qua (trang hiện thông báo thay vì crash).

### 7.7 Test dùng `of(...)` = **phát ngay, đồng bộ**
Nên `form.onSubmit(); fixture.detectChanges();` là assertion chạy được ngay — không cần chờ, không dùng HTTP thật trong test.

---

## 8. Chạy & nghiệm thu

### Cách chạy (2 terminal)

```powershell
# Terminal 1 — API
cd K:\CongNgheWeb\StockMarket
json-server --watch data.json          # cổng 3000

# Terminal 2 — App
cd K:\CongNgheWeb\StockMarket
ng serve                                # cổng 4200
```

### Checklist tay

| # | Đường dẫn | Thao tác | Phải thấy |
|---|---|---|---|
| 1 | `/login` | `khoa` / `123456` → Login | Vào `/stock-item`, **bảng tự hiện, KHÔNG cần F5** |
| 2 | `/get-data` | Mở trang | Bảng có cột **ID** (11 ký tự nếu do server sinh); Network → `stocks` = 200 |
| 3 | `/post-data` | Submit form | Hiện **id server cấp**; `data.json` **+1 bản ghi** |
| 4 | `/stock-item` | ⭐ Favorite | `data.json` → `"favorite": true` |
| 5 | `/stock-item` | Sửa giá 1 mã ⭐ | Bảng hiện ngay; `data.json` đổi giá **+ favorite còn nguyên** |
| 6 | `/stock-item` | Remove | Dòng biến mất; `data.json` **−1 bản ghi** |
| 7 | `/stock-item` | Gõ ô tìm kiếm | Lọc theo name/code/exchange |
| 8 | Tắt json-server → F5 `/stock-item` | — | Thông báo lỗi thân thiện, **không crash trắng trang** |

### Trạng thái nghiệm thu lần cuối

- [x] `ng build` — **OK**, bundle `main` 370.66 kB (94.72 kB transfer), **Prerendered 7 static routes**
- [x] Login → dữ liệu tự hiện không cần F5 — **đã chứng minh bằng tự động hóa trình duyệt**
- [x] `ng test` — **7 file / 10 test PASSED** — áp dụng bước (4) ở mục 7.5 (thêm `fixture.detectChanges()` trong `beforeEach` của `stock-list.spec.ts`)

### Lệnh kiểm tra cuối

```powershell
npx ng test      # kỳ vọng: Test Files 7 passed (7) | Tests 10 passed (10)
npx ng build     # kỳ vọng: Application bundle generation complete
```

---

## 9. Lệnh Angular CLI (nội dung gốc của README do Angular CLI tạo)

<details>
<summary>Mở rộng</summary>

- Chạy server dev: `ng serve` → mở `http://localhost:4200/`
- Sinh component/service: `ng generate component ten-component` / `ng g service services/ten --skip-tests`
- Build: `ng build` (kết quả ở `dist/`)
- Test: `ng test` (Vitest)
- E2E: `ng e2e`
- Tài liệu: [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)

</details>
