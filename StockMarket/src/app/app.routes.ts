import { Routes } from '@angular/router';
import { Login } from './login/login';
import { StockItem } from './stock/stock-item/stock-item';
import { CreateStock } from './stock/create-stock/create-stock';
import { CreateStockForm } from './stock/create-stock-form/create-stock-form';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'stock-item',
        component: StockItem
    },
    {
        path: 'create-stock',
        component: CreateStock
    },
    {
        path: 'create-stock-form',
        component: CreateStockForm
    }
];
