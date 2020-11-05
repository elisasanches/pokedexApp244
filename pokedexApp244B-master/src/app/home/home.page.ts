import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public listaPokemons: any = [];
  public pagina = 1;
  public totalPaginas = 0;
  public url = "https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0"
  public next: string;
  public previous: string;

  constructor(private pokemonService: PokemonService) { }

  ionViewWillEnter() {
    this.buscarPokemons(1);
  }

  public buscarPokemons(pagina: number) {
    if (pagina <= 0) {
      pagina = 1;
    }
    this.pagina = pagina;

    this.pokemonService.buscarPokemons(this.url).subscribe(dados => {
      this.listaPokemons = [];
      this.totalPaginas = dados['count'] / 10;
      let listaApi = dados['results'];
      this.next = dados['next'];
      this.previous = dados['previous'];
      for (let item of listaApi) {
        this.pokemonService.buscaPokemonNumero(item.url).subscribe(dadosPokemon => {
          this.listaPokemons.push(dadosPokemon);

          this.ordenarLista();
        });
      }
      console.log("Lista: ", this.listaPokemons);
    });
  }

  public nextPage() {
    this.url = this.next;
    this.buscarPokemons(this.pagina + 1);
  }

  public previousPage() {
    this.url = this.previous;
    this.buscarPokemons(this.pagina - 1);
  }

  public ordenarLista(){
    this.listaPokemons.sort((a, b) =>{
      if(a.id > b.id){
        return 1;
      }
      if(a.id < b.id) {
        return -1;
      }
      return 0;
    });

  }
}
