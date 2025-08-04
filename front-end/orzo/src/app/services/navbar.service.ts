import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _isExpanded = signal(true);
  
  get isExpanded() {
    return this._isExpanded.asReadonly();
  }
  
  toggle() {
    this._isExpanded.update(value => !value);
  }
  
  expand() {
    this._isExpanded.set(true);
  }
  
  collapse() {
    this._isExpanded.set(false);
  }
}