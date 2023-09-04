import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { TypeStatusComponent } from './type-status/type-status.component';
import { TypeBankAccountComponent } from './type-bank-account/type-bank-account.component';
import { TypeUserComponent } from './type-user/type-user.component';
import { TypeServiceComponent } from './type-service/type-service.component';
import { ManualComponent } from './manual/manual.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { CountryComponent } from './country/country.component';
import { PromotionComponent } from './promotion/promotion.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { CampusComponent } from './campus/campus.component';

const routes: Routes = [
  {
    path: 'country',
    component: CountryComponent
  },
  {
    path: 'typeDocument',
    component: TypeDocumentComponent
  },
  {
    path: 'typeStatus',
    component: TypeStatusComponent
  },
  {
    path: 'typeBankAccount',
    component: TypeBankAccountComponent
  },
  {
    path: 'typeUser',
    component: TypeUserComponent
  },
  {
    path: 'typeService',
    component: TypeServiceComponent
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
    path: 'product',
    component: ProductComponent
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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
