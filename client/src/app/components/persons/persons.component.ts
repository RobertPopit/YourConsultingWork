import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { SCROLL_TOP, SET_HEIGHT } from "src/app/utils/utils-table";
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { PersonsModalComponent } from "./persons-modal/persons-modal.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";


@Component({
    selector: 'app-persons',
    templateUrl: './persons.component.html',
    styleUrls: ['./persons.component.scss']
  })
  export class PersonsComponent implements OnInit {
    faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
    limit: number = 70; showBackTop: string = '';
    persons: any = [];
  
    constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }
  
    ngOnInit(): void {
      this.loadData();
    }
  
    loadData = (): void => {
      this._spinner.show();
      axios.get('/api/persons').then(({ data }) => {
        this.persons = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
    }
  
    addEdit = (id_persons?: number): void => {
      const modalRef = this._modal.open(PersonsModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.id_persons = id_persons;
      modalRef.closed.subscribe(() => {
        this.loadData();
      });
    }
  
    delete = (person: any): void => {
      const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.title = `Ștergere persoana`;
      modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana având numele <b>${person.nume}</b>, prenumele: <b>${person.prenume}</b>?`;
      modalRef.closed.subscribe(() => {
        axios.delete(`/api/persons/${person.id}`).then(() => {
          this.toastr.success('Informația a fost ștearsă cu succes!');
          this.loadData();
        }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
      });
    }
  
    onResize(): void {
      SET_HEIGHT('view', 20, 'height');
    }
  
    showTopButton(): void {
      if (document.getElementsByClassName('view-scroll-persons')[0].scrollTop > 500) {
        this.showBackTop = 'show';
      } else {
        this.showBackTop = '';
      }
    }
  
    onScrollDown(): void {
      this.limit += 20;
    }
  
    onScrollTop(): void {
      SCROLL_TOP('view-scroll-persons', 0);
      this.limit = 70;
    }

    getMasiniString(person: any): string {
        if (person.masini && person.masini.length > 0) {
          return person.masini.map((m: any) => m.nume).join(', ');
        }
        return 'Fără mașini';
      }
  }