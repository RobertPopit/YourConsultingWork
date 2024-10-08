import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';
import { CarsComponent } from '../../cars/cars.component';

@Component({
  selector: 'app-persons-modal',
  templateUrl: './persons-modal.component.html'
})
export class PersonsModalComponent implements OnInit {
  @Input() id_persons: number | undefined;

  isCnpValid = true;
  isVarstaValid = true;
  isNumeValid = true;
  isPrenumeValid = true;
  masini: any[] = [];
  modal = {masini: [] } as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_persons) {
      this._spinner.show();
      axios.get(`/api/persons/${this.id_persons}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }

    axios.get('/api/cars').then(({ data }) => {
        this.masini = data;
      });
  }



  onCnpChange() {
    this.modal.varsta = this.calculateVarstaFromCNP(this.modal.cnp);
  }

  save(): void {
    this.isCnpValid = true;
    this.isVarstaValid = true;
    this.isNumeValid = true;
    this.isPrenumeValid = true;

    
    let isValid = true;

    if (!this.modal.cnp || this.modal.cnp.toString().length !== 13) {
      this.isCnpValid = false;
      isValid = false;
    }

    if (!this.modal.varsta || this.modal.varsta.toString().length > 3) {
      this.isVarstaValid = false;
      isValid = false;
    }

    if (!this.modal.nume || this.modal.nume.trim() === '') {
      this.isNumeValid = false;
      isValid = false;
    }

    if (!this.modal.prenume || this.modal.prenume.trim() === '') {
      this.isPrenumeValid = false;
      isValid = false;
    }

    if (!isValid) {
      this.toastr.error('Verificați câmpurile marcate.', 'Eroare Validare');
      return;
    }


    this._spinner.show();
    if (!this.id_persons) {

      axios.post('/api/persons', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/persons', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }

  calculateVarstaFromCNP(cnp: string): number {
    if (!cnp || cnp.length !== 13) {
      return 0; 
    }
  
    const secol = parseInt(cnp.charAt(0), 10);
    const anNastere = parseInt(cnp.substring(1, 3), 10);
    let anulComplet = 0;
  
    if (secol === 1 || secol === 2) {
      anulComplet = 1900 + anNastere;
    } else if (secol === 3 || secol === 4) {
      anulComplet = 1800 + anNastere;
    } else if (secol === 5 || secol === 6) {
      anulComplet = 2000 + anNastere;
    }
  
    const currentYear = new Date().getFullYear();
    const varsta = currentYear - anulComplet;
  
    return varsta;
  }
}
