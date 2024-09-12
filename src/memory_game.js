const emojis = [
    "🧳", "🌂", "☂️", "🧵", "🪡", "🪢", "🪭", "🧶", "👓", "🕶", "🥽", "🥼", "🦺", "👔", "👕", "👖",
    "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩴", "🩱", "🩲", "👙", "👚", "👛", "👜", "👝", "🎒",
    "👞", "👟", "🥾", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑", "🪖", "💄", "💍", 
    "💼", "🐶", "🐱", "🐭", "🐹", "🐰", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", 
    "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐦‍⬛", "🐤", "🐣", "🐥", "🦆", "🦅", 
    "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", 
    "🦟", "🦗", "🕷", "🕸", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🪼", 
    "🪸", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🫏", "🦍", "🦧", "🦣", 
    "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🦙", "🦌", 
    "🌵", "🎄", "🌲", "🌳", "🌴", "🪹", "🪺", "🪵", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🎋", "🍃", 
    "🍂", "🍄", "🟫", "🐚", "🪨", "🌾", "💐", "🌷", "🪷", "🌹", "🥀", "🌺", "🌸", "🪻", "🌼", "🌻", 
    "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌑", "🌙", "🌎", "🪐", "💫", "⭐️", "🌟", "✨", 
    "⚡️", "☄️", "💥", "🔥", "🌪", "🌈", "☀️", "⛈", "⛄️", "💦"
  ];
  
document.querySelector(".reset").addEventListener("click", ()=>{
  document.location.reload()
})
populate()


function populate(){
  const gameCards=pickBoardCards(4,4);
  for(let i=0;i<gameCards.length;i++){
    let card = document.createElement("div");
    card.className="item";
    card.innerHTML=gameCards[i];
    document.querySelector(".game").appendChild(card);
  }
}

function pickBoardCards(n, m) {
  let  temp = shuffle(emojis).slice(0,(n*m)/2);
  
  return shuffle([...temp, ...temp])
}

function shuffle(array){
  shuffledArray = [];
  const length = array.length;

  for (let i = 0; i < length; i++) {
    let index=Math.floor(Math.random() * array.length);
    shuffledArray.push(array[index]);
    array=array.slice(0,index).concat(array.slice(index+1));
  }
  return shuffledArray
}

console.log(pickBoardCards(4,4))