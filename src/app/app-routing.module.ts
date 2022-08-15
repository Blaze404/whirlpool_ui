import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { StatisticsComponent } from './statistics/statistics.component';
import { InventoryComponent } from './inventory/inventory.component';

const routes: Routes = [
  { path:  '', component:  DashboardComponent
  ,canActivate: [AuthGuard]
},
  {path: 'login', component: LoginComponent
  },
  
    { path:  'stats', component:  StatisticsComponent
      ,canActivate: [AuthGuard]
    },
    { path:  'inventory', component:  InventoryComponent
      ,canActivate: [AuthGuard]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
