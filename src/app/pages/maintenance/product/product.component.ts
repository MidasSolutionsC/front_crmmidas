import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Product, ProductList, ResponseApi, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, ProductService, SweetAlertService, TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear producto',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Productos';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  productForm: FormGroup;


  // Table data
  // content?: any;
  lists?: ProductList[];

  // Tipo de servicios;
  listServices?: TypeServiceList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _typeServiceService: TypeServiceService,
    private _productService: ProductService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'},{ label: 'Productos', active: true }]);

    this.initForm();
    this.listDataApi();
    this.apiTypeServiceList();

    // Promociones
    this.subscription.add(
      this._productService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: ProductList[]) => {
        this.lists = list;
      })
    );

    // Tipo de servicios
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listServices = list;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public listDataApi(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._productService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.lists = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private saveDataApi(data: Product){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._productService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data){
            const {product, productPrice} = response.data;
            if(product){
              const data: ProductList = ProductList.cast(product);
              this._productService.addObjectObserver(data);
            }

          }

          this.modalRef?.hide();
        }

        if(response.code == 422){
          if(response.errors){
            // const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            // this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});

            const {product_errors, price_errors} = response.errors;
            let textErrors = '';

            if(product_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(product_errors);
            }

            if(price_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(price_errors);
            }

            if(textErrors != ''){
              this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            }
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        console.log(error);
      })
    )
  }

  private updateDataApi(data: Product, id: number){
    this._sweetAlertService.loadingUp()
    this._productService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 201){
        // const data: ProductList = ProductList.cast(response.data[0]);
        // this._productService.updateObjectObserver(data);
        
        if(response.data){
          const {product, productPrice} = response.data;
          if(product){
            const data: ProductList = ProductList.cast(product);
            this._productService.updateObjectObserver(data);
          }
        }

        this.modalRef?.hide();
      }

      if(response.code == 422){
        if(response.errors){
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
        }
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private deleteDataApi(id: number){
    this._sweetAlertService.loadingUp()
    this._productService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: ProductList = ProductList.cast(response.data[0]);
        this._productService.removeObjectObserver(data.id);
      }

      if(response.code == 422){
        if(response.errors){
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
        }
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  
  /**
   * OPERACIONES DE TABLAS FORÁNEAS
   */
  // Tipo documento
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listServices = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }


  /**
   * Form data get
   */
  get form() {
    return this.productForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const product = new Product();
    const formGroupData = this.getFormGroupData(product);
    this.productForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Product): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      tipo_servicios_id: ['', [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.nullValidator, Validators.min(0)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear producto';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.productForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Product = this.productForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el producto?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el producto?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(values, values.id);
          }
        });
      }
    }

    this.submitted = true;
  }

  /**
 * Open Edit modal
 * @param content modal content
 */
  editDataGet(id: any, content: any) {
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.dataModal.title = 'Editar producto';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const product = Product.cast(data);
    this.productForm = this.formBuilder.group({...this._formService.modelToFormGroupData(product), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el producto?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
