const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

const searchInput = getElement('.search-input'),
      searchButton = getElement('.search-button'),
      container = getElement('.pokemon-container'),
      erroMessage = getElement('.error');
const btnAdd = document.getElementById('btnAdd')
const list = document.getElementById('list')

let pokeName,
    pokemon,
    card;

let array = []

const arrayStorage =JSON.parse(localStorage.getItem('savedPokemons')) 

if (arrayStorage) {
  array = arrayStorage
}

function getElement(element) {
    return document.querySelector(element);
}

function requestPokeInfo(url, name) {
    fetch(url + name)
      .then(response => {
        if(response.status === 404){
          return alert('Pokemon não encontrado!')
        }else{
          return response.json()
        }
      })
      .then(data => {
        pokemon = data;
      })
      .catch(err => console.log(err));
}

function createCard () {
    card = `
    <div class="pokemon-picture">
      <img src="${pokemon.sprites.front_default}" alt="Sprite of ${pokemon.name}">
    </div>
    <div class="pokemon-info">
        <h1 class="name">Name: ${pokemon.name}</h1>
        <h2 class="number">Nº ${pokemon.id}</h2>
        <h3 class="type">Type: ${pokemon.types.map(item => item.type.name).toString()}</h3>
        <h3 class="skill">Skills: ${pokemon.moves.map(item => ' ' + item.move.name).toString()}</h3>
        <h3 class="weight">Weight: ${pokemon.weight  / 10}kg</h3>
        <h3 class="height">Height: ${pokemon.height  / 10}m</h3>
    </div>`;
    return card;
  }

function showList(arrayPokemons) {
  arrayPokemons.forEach(element => {
    const div = document.createElement('div')
    div.setAttribute("class", "container-list")

    const divImg = document.createElement('div')
    divImg.classList.add('pokemon-info') 
    divImg.innerHTML = `
      <img src="${element.sprites.front_default}" alt="Sprite of ${element.name}">
    `

    const divInfo = document.createElement('div')
    divInfo.setAttribute('class', 'pokemon-info')
    divInfo.innerHTML = `
      <h1 class="name">Name: ${element.name}</h1>
      <h2 class="number">Nº ${element.id}</h2>
      <h3 class="type">Type: ${element.types.map(item => item.type.name).toString()}</h3>
      <h3 class="weight">Weight: ${element.weight  / 10}kg</h3>
      <h3 class="height">Height: ${element.height  / 10}m</h3>
    `

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', (e) => {
      removePokemon(element);
      list.removeChild(e.target.parentElement)
    });

    div.appendChild(divImg)
    div.appendChild(divInfo)
    div.appendChild(deleteButton);
    list.appendChild(div)
  });
}  

function removePokemon(pokemon) {
  const index = array.findIndex(p => p.id === pokemon.id);
  if (index !== -1) {
    array.splice(index, 1);
    localStorage.setItem('savedPokemons', JSON.stringify(array))
  }
}

function startApp(pokeName) {
  requestPokeInfo(baseUrl, pokeName);
    setTimeout(function () {
      if(!pokemon) {
        container.style.display = 'none';
      }else{
        erroMessage.style.display = 'none';
        container.style.display = 'flex';
        
        const card = createCard();
        container.innerHTML = card
      }
    }, 2000);
}

function savePokemon(pokemon) {
  array.push(pokemon);
  localStorage.setItem('savedPokemons', JSON.stringify(array));
}


searchButton.addEventListener('click', event => {
    event.preventDefault();
    pokeName = searchInput.value.toLowerCase();
    startApp(pokeName);
    container.classList.add('fade');
  
    setTimeout(() => {
      container.classList.remove('fade');
    }, 3000);
  });

  btnAdd.addEventListener('click', ()=>{
    list.innerHTML = ''
    savePokemon(pokemon)

    const arr = JSON.parse(localStorage.getItem('savedPokemons')) 
    console.log(arr);
    showList(arr)
  })

const arr = JSON.parse(localStorage.getItem('savedPokemons')) 
showList(arr)