import { AppMessage, MessageService } from './message.service';

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('MessageService', () => {
  let service: MessageService;
  let latest: AppMessage | null;

  beforeEach(() => {
    service = new MessageService();
    latest = null;
    service.message$.subscribe((message) => (latest = message));
  });

  afterEach(() => {
    service.clear(); // dọn timer tự ẩn sau 5s
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('shows success/error messages and clears them', async () => {
    service.error('That bai');
    await nextTick(); // show() defer 1 tick
    expect(latest).toEqual({ text: 'That bai', type: 'error' });

    service.success('Thanh cong');
    await nextTick();
    expect(latest).toEqual({ text: 'Thanh cong', type: 'success' });

    service.clear();
    expect(latest).toBeNull();
  });
});
