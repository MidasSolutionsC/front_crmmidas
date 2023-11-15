import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualComponent } from './manual/manual.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { CountryComponent } from './country/country.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { CampusComponent } from './campus/campus.component';
import { BrandComponent } from './brand/brand.component';
import { ServiceComponent } from './service/service.component';
import { CategoryComponent } from './category/category.component';


const routes: Routes = [
  {
    path: 'country',
    component: CountryComponent
  },
 
  {
    path: 'manual',
    component: ManualComponent
  },
  {
    path: 'advertisement',
    component: AdvertisementComponent
  },
  {
    path: 'promotion',
    component: PromotionComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'brand',
    component: BrandComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'service',
    component: ServiceComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'group',
    component: GroupComponent
  },
  {
    path: 'campus',
    component: CampusComponent
  },
  { path: 'types', loadChildren: () => import('./type/type.module').then(m => m.TypeModule) },
  { path: 'call-settings', loadChildren: () => import('./call/call.module').then(m => m.CallModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
