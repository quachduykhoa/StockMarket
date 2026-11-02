import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { StockList } from './stock/stock-list/stock-list';
import { CreateStockForm } from './stock/create-stock-form/create-stock-form';
import { StockDetailsComponent } from './stock/stock-details/stock-details';
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
        path: 'register',
        component: Register
    },
    {
        path: 'stock-item',
        component: StockList
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
    },
    {
        path: 'stock/:code',
        component: StockDetailsComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
