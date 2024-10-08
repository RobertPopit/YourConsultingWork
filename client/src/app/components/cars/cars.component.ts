import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { SCROLL_TOP, SET_HEIGHT } from "src/app/utils/utils-table";
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { InformationModalComponent } from "../information/information-modal/information-modal.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { CarsModalComponent } from "./cars-modal/cars-modal.component";


@Component({
    selector: 'app-cars',
    templateUrl: './cars.component.html',
    styleUrls: ['./cars.component.scss']
  })
  export class CarsComponent implements OnInit {
    faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
    limit: number = 70; showBackTop: string = '';
    cars: any = [];
  
    constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }
  
    ngOnInit(): void {
      this.loadData();
    }
  
    loadData = (): void => {
      this._spinner.show();
      axios.get('/api/cars').then(({ data }) => {
        this.cars = data;

        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
    }
  
    addEdit = (id_cars?: number): void => {
      const modalRef = this._modal.open(CarsModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.id_cars = id_cars;
      console.log(modalRef.closed)
      modalRef.closed.subscribe(() => {
        this.loadData();
      });
    }
  
    delete = (car: any): void => {
      const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.title = `Ștergere informație`;
      modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având marca <b>${car.denumire_marca}</b>, modelul: <b>${car.denumire_model}</b>?`;
      modalRef.closed.subscribe(() => {
        axios.delete(`/api/cars/${car.id}`).then(() => {
          this.toastr.success('Informația a fost ștearsă cu succes!');
          this.loadData();
        }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
      });
    }
  
    onResize(): void {
      SET_HEIGHT('view', 20, 'height');
    }
  
    showTopButton(): void {
      if (document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500) {
        this.showBackTop = 'show';
      } else {
        this.showBackTop = '';
      }
    }
  
    onScrollDown(): void {
      this.limit += 20;
    }
  
    onScrollTop(): void {
      SCROLL_TOP('view-scroll-cars', 0);
      this.limit = 70;
    }
  }