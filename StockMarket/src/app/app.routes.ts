import { Routes } from '@angular/router';
import { Login } from './login/login';
import { StockList } from './stock/stock-list/stock-list';
import { CreateStock } from './stock/create-stock/create-stock';
import { CreateStockForm } from './stock/create-stock-form/create-stock-form';
import { GetDataComponent } from './get-data/get-data.component'; 
import { PostDataComponent } from './post-data/post-data.component'; 

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
        component: StockList
    },
    {
        path: 'create-stock',
        component: CreateStock
    },
    {
        path: 'create-stock-form',
        component: CreateStockForm
    },
    {
        path: 'get-data',
        component: GetDataComponent
    },
    {
        path: 'post-data',
        component: PostDataComponent
    }
];
