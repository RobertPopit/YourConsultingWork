import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cars-modal',
  templateUrl: './cars-modal.component.html'
})
export class CarsModalComponent implements OnInit {
  @Input() id_cars: number | undefined;

  isDenumireValid = true;
  isDenumireModelValid = true;
  isAnFabricatieValid = true;
  isCapacitateCilindricaValid = true;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_cars) {
      this._spinner.show();
      axios.get(`/api/cars/${this.id_cars}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
  }

  onTaxaChange() {
    this.modal.taxa_impozit = this.calculateTaxaImpozit(this.modal.capacitatea_cilindrica);
  }

  save(): void {

    this.isDenumireValid = true;
    this.isDenumireModelValid = true;
    this.isAnFabricatieValid = true;
    this.isCapacitateCilindricaValid = true;

    let isValid = true;

    if (!this.modal.denumire_marca || this.modal.denumire_marca.trim() === '') {
      this.isDenumireValid = false;
      isValid = false;
    }

    if (!this.modal.denumire_model || this.modal.denumire_model.trim() === '') {
      this.isDenumireModelValid = false;
      isValid = false;
    }

    if (!this.modal.anul_fabricatiei || this.modal.anul_fabricatiei.toString().length > 4 ) {
      this.isAnFabricatieValid = false;
      isValid = false;
    }

    if (!this.modal.capacitatea_cilindrica || this.modal.capacitatea_cilindrica.toString().length > 4) {
      this.isCapacitateCilindricaValid = false;
      isValid = false;
    }

    if (!isValid) {
      this.toastr.error('Verificați câmpurile marcate.', 'Eroare Validare');
      return;
    }

    this._spinner.show();
    if (!this.id_cars) {
      axios.post('/api/cars', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/cars', this.modal).then(() => {
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

  calculateTaxaImpozit(capacitateaCilindrica: number): number {
    let taxa: number = 0; 

    if (capacitateaCilindrica < 0) {
        throw new Error("Capacitatea cilindrică nu poate fi negativă.");
    } else if (capacitateaCilindrica < 1500) {
        taxa = 50;
    } else if (capacitateaCilindrica >= 1500 && capacitateaCilindrica < 2000) {
        taxa = 100;
    } else if (capacitateaCilindrica >= 2000) {
        taxa = 200;
    }

    return taxa;
}
}
