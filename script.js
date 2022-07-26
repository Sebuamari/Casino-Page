const games =  document.querySelector(".games-list");
const showMore = document.querySelector(".show-more");
const spinner = document.querySelector(".loading");
const container = document.querySelector(".games");
const filter = document.querySelector(".lookfor-input");
const search = document.querySelector(".search-icon")
const APIurl = 'https://mystake.com/api/game/getgametemplates/1/1/1';
const IMGURL = "https://static.inpcdn.com/";
let data =[];
let order = 0;


// function that makes the loading animation show
function startLoading() {
  spinner.classList.add("display");
}

// function that makes the loading animation hide
function stopLoading() {
  spinner.classList.remove("display");
}

// function that loads 60 more games
function loadMoreGames() {
  startLoading();
  order+=60;
  loadGames();
}

// function that clears all the game shown
function clearGames(){
  games.innerHTML=``;
}

// function that loads 60 games
function loadGames(){
  startLoading();
  fetch(APIurl)
	.then(response => response.json())
  .then(
    response => {
      stopLoading();
      data = response.GameTemplates.sort(function(a,b) { return a.DefaultOrdering-b.DefaultOrdering });
      games.innerHTML += `<div class="new-games-container"></div>`;
        for(let i=0; i<60; i++){
          let id = response.GameTemplateNameTranslations[order].GameTemplateId;
          let uri = response.GameTemplateImages.filter(game => game.GameTemplateId===id);
          document.querySelector(".new-games-container").innerHTML+=`
          <div class="box">
            <img class="game" src="${IMGURL}${uri[0].CdnUrl}" alt="game banner"/>
            <div class="game-name">
                <p>${response.GameTemplateNameTranslations[order].Value}</p>
                <p>name</p>
            </div>
          </div>
          `;
          order++;
      }
      document.querySelector(".new-games-container").className="games-container";
})}

//function that filters games according to user input data
function filterGames(){
  let input = filter.value;
  var pattern = new RegExp(input,"gi");
  startLoading();
  fetch(APIurl)
	.then(response => response.json())
  .then(
    response => {
      stopLoading();
      clearGames();
      data = response.GameTemplates.sort(function(a,b) { return a.DefaultOrdering-b.DefaultOrdering });
      targetGames = response.GameTemplateNameTranslations.filter(game => game.Value.match(pattern));
      if(targetGames.length===0){
        games.innerHTML += `<p class="error">Nothing Matches with - ${input}</p>`;
      } else {
        games.innerHTML += `<div class="new-games-container"></div>`;
        for(let i=0; i<targetGames.length; i++){
          let id = response.GameTemplateNameTranslations[order].GameTemplateId;
          let uri = response.GameTemplateImages.filter(game => game.GameTemplateId==targetGames[i].GameTemplateId);
          console.log(uri);
          document.querySelector(".new-games-container").innerHTML+=`
          <div class="box">
            <img class="game" src="${IMGURL}${uri[0].CdnUrl}" alt="game banner"/>
            <div class="game-name">
                <p>${targetGames[i].Value}</p>
                <p>name</p>
            </div>
          </div>
          `;

        console.log(i)
        }
      document.querySelector(".new-games-container").className="games-container";
      }
    })
  // disappear show-more button for filtered games
  showMore.style.display="none";
}

// load 60 games at start
loadGames();

// event listeners for show-more button to load 60 more games, for input field
// and for search button to filter the games
showMore.addEventListener("click", loadMoreGames);
filter.addEventListener("change",filterGames);
search.addEventListener("click", filterGames);