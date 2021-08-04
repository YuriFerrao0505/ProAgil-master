import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
  titulo='Eventos';

  eventosFiltrados: Evento[]=[];
  eventos: Evento[]=[];
  evento!: Evento;
  modoSalvar = 'post'

  imagemLargura = 50;
  imagemMargem =2;
  mostrarImagem = true;
  registerForm: FormGroup | any;
  bodyDeletarEvento='';

  file: File | any;

  _filtroLista: string = '';
  fileNameToUpdate: string = '';
  dataAtual:string = '';
  
  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    ) { 
      this.localeService.use('pt-br');
    }
  
  get filtroLista(){
    return this._filtroLista;
  }
  set filtroLista(value:string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put'
    this.openModal(template);
    this.evento = Object.assign({},evento);
    this.fileNameToUpdate = evento.imagemUrl.toString();
    this.evento.imagemUrl='';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any){
    this.modoSalvar = 'post'
    this.openModal(template);
  }

  excluirEvento(evento:Evento, template:any){
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento =`Tem certeza que deseja excluir o Evento:${evento.tema}, Código: ${evento.id}`;
  }
  
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso!');
        }, error => {
          this.toastr.error('Erro ao Tentar Deletar!');
          console.log(error);
        }
    );
  }

  openModal(template: any){
    template.show();
    this.registerForm.reset();
    
  }

  ngOnInit() {
    this.getEventos();
    this.validation();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string;}) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor)!== -1
    );
    
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm=this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemUrl: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

   onFileChange(event: any){
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length){
      this.file = event.target.files;
      
    }
  }

  uploadImage(){
    if(this.modoSalvar==='post') {
    const nomeArquivo = this.evento.imagemUrl.split('\\', 3);
    this.evento.imagemUrl= nomeArquivo[2];
   
    this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
      () =>{
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      }
    );
    }else{
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(
        () =>{
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
    
  }

  salvarAlteracao(template:any){
    if(this.registerForm.valid){
      if(this.modoSalvar==='post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImage();
        
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento | any) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao inserir: ${error}`);
          }
        );
      }else{
        this.evento = Object.assign({id:this.evento.id}, this.registerForm.value);

        this.uploadImage();

        this.eventoService.putEvento(this.evento).subscribe(
          (novoEvento: Evento | any) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao inserir: ${error}`);
          }
        );
      }
    }
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
    (_eventos: Evento[]) =>
    {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos
      console.log(_eventos);
    }, error =>
    {
      this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);    
    });
  }

}
