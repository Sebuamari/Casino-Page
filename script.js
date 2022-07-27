const games =  document.querySelector(".games-list");
const showMore = document.querySelector(".show-more");
const spinner = document.querySelector(".loading");
const container = document.querySelector(".games");
const filter = document.querySelector(".lookfor-input");
const search = document.querySelector(".search-icon")
const APIurl = 'https://mystake.com/api/game/getgametemplates/1/1/1';
const IMGURL = "https://static.inpcdn.com/";
let gameName;
let data =[];
let gamesNum = 0;


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
  if(gamesNum>data.length){
    showMore.style.display="none";
    games.innerHTML += `<p class="error">No More Games to Load...</p>`;
  } else {
    startLoading();
    gamesNum+=60;
    loadGames();
  }
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
          let id = data[gamesNum].ID; // storing game ID
          let url = response.GameTemplateImages.filter(game => game.GameTemplateId===id); // storing game template URL
          gameName = response.GameTemplateNameTranslations.filter(game => game.GameTemplateId===id);
          // switching to next game if no template URL or name is found for that game ID
          if(gameName.length===0 || url.length===0){
            gamesNum++;
            id = data[gamesNum].ID;
            gameName = response.GameTemplateNameTranslations.filter(game => game.GameTemplateId===id);
            url = response.GameTemplateImages.filter(game => game.GameTemplateId===id);
          }
          // showing game template and name
          document.querySelector(".new-games-container").innerHTML+=`
              <div class="box">
                <img class="game" src="${IMGURL}${url[0].CdnUrl}" alt="game banner"/>
                <div class="game-name">
                    <p>${gameName[0].Value}</p>
                </div>
              </div>
              `;
          gamesNum++;
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
      if(input.length===0){
        stopLoading();
        clearGames();
        games.innerHTML += `<p class="error">Please type something to look for</p>`;
      } else {
        stopLoading();
        clearGames();
        data = response.GameTemplates.sort(function(a,b) { return a.DefaultOrdering-b.DefaultOrdering });
        targetGames = response.GameTemplateNameTranslations.filter(game => game.Value.match(pattern));
        // if no matches found
        if(targetGames.length===0){
          games.innerHTML += `<p class="error">Nothing Matches with - ${input}</p>`;
        }
        // showing found matches
        else {
          games.innerHTML += `<div class="new-games-container"></div>`;
          for(let i=0; i<targetGames.length; i++){
            let url = response.GameTemplateImages.filter(game => game.GameTemplateId==targetGames[i].GameTemplateId);
            if(url.length!==0){
              document.querySelector(".new-games-container").innerHTML+=`
              <div class="box">
                <img class="game" src="${IMGURL}${url[0].CdnUrl}" alt="game banner"/>
                <div class="game-name">
                    <p>${targetGames[i].Value}</p>
                    <p>name</p>
                </div>
              </div>
              `;
            }
          }
          document.querySelector(".new-games-container").className="games-container";
        }
      }
    })
  // disappear show-more button for filtered games
  showMore.style.display="none";
}

// event listeners for show-more button to load 60 more games, for input field
// and for search button to filter the games
showMore.addEventListener("click", loadMoreGames);
search.addEventListener("click", filterGames);

// load 60 games at start
loadGames();