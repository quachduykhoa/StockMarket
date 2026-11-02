import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // trang 33: route param 'stock/:code' — có param nên render khi có request
    // (không thể prerender tĩnh vì code chỉ biết lúc người dùng mở URL)
    path: 'stock/:code',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
