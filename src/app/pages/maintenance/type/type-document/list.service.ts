/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './list-sortable.directive';
import { TypeDocument } from 'src/app/core/models';

interface SearchResult {
  typeDocumentList: TypeDocument[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  type: string;
  date: string;
}

const compare = (v1: string | any, v2: string | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(typeDocumentList: TypeDocument[], column: SortColumn, direction: string): TypeDocument[] {
  if (direction === '' || column === '') {
    return typeDocumentList;
  } else {
    return [...typeDocumentList].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(typeDocument: TypeDocument, term: string, pipe: PipeTransform) {
  return typeDocument.nombre.toLowerCase().includes(term.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class TypeDocumentListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private typeDocumentList$ = new BehaviorSubject<TypeDocument[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private dataArray = [];

  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    type: '',
    date: '',
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this.typeDocumentList$.next(result.typeDocumentList);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get jobList$() { return this.typeDocumentList$.asObservable(); }
  get product() { return this.products; }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }
  get status() { return this._state.status; }
  get type() { return this._state.type; }
  get date() { return this._state.date; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
  set status(status: any) { this._set({status}); }
  set type(type: any) { this._set({type}); }
  set date(date: any) { this._set({date}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, status, type, date} = this._state;

    // 1. sort
    let typeDocumentList = sort(this.dataArray, sortColumn, sortDirection);    

    // 2. filter
    typeDocumentList = typeDocumentList.filter(typeDocument => matches(typeDocument, searchTerm, this.pipe));  
    
    // 3. Status Filter
    if(status){
      // jobList = jobList.filter(typeDocument => typeDocument.status == status);
    }
    else{
      typeDocumentList = typeDocumentList;
    }

    // 4. Type Filter
    if(type){
      typeDocumentList = typeDocumentList.filter(typeDocument => typeDocument.abreviacion == type);
    }
    else{
      typeDocumentList = typeDocumentList;
    }

    const total = typeDocumentList.length;

    // 3. paginate
    this.totalRecords = typeDocumentList.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    typeDocumentList = typeDocumentList.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({typeDocumentList, total});
  }
}
