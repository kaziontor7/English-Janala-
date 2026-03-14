const createElement= (arr)=>{
  const elements = arr.map((el)=> `<span class="btn">${el}</span>` )
  return elements.join(" ");
}
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const load = (value)=>{
  if(value===true){
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  }
  else{
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('word-container').classList.remove('hidden');
  }
}



const getLevels = ()=>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
  .then(res=>res.json())
  .then(levels=> displayLessons(levels.data));
  }
const removeCls = () =>{
  const lessonButtons = document.querySelectorAll('.all-btn')
  lessonButtons.forEach(btns => {
    btns.classList.remove('bg-[#422AD5]', 'text-white')
  });

}


  const fetchWords=(vocab)=>{
    load(true);
    fetch(`https://openapi.programming-hero.com/api/level/${vocab}`)
    .then(res=>res.json())
    .then(word=>{
        removeCls();
        const btnLesson = document.getElementById(`lessonBtn-${vocab}`)
        btnLesson.classList.add('bg-[#422AD5]', 'text-white')
        showWords(word.data)})
        
  }

  const fetchWordDetails = async(id)=>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
  }

  const displayWordDetails = word =>{
    
   const detailsContainer = document.getElementById('details-container');
   detailsContainer.innerHTML=` <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Synonym</h2>
            <div class="">${createElement(word.synonyms)}</div>
          </div>
    
    `;

    document.getElementById('word_modal').showModal()
   

  }

  const showWords=(word)=>{
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML="";
  if(word.length==0){
    wordContainer.innerHTML=`
    <div class="bangla py-16 col-span-full text-center">
       <img class="pb-3.5 mx-auto" src="./assets/alert-error.png" alt="">
      <p class="text-sm text-[#79716B] pb-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h1 class="text-3xl font-medium">নেক্সট Lesson এ যান</h1>
     </div>
    
    `
    load(false)
    return;
  }

    word.forEach(elements => {
        const newE = document.createElement('div');
        newE.innerHTML=`
        <div class="bg-white rounded-xl p-10 text-center h-full ">
        <h2 class="text-3xl font-bold">${elements.word ? elements.word : "শব্দ পাওয়া যায়নি"}</h2>
        <p class="py-6 text-xl font-medium">Meaning /Pronunciation</p>
        <p class="bangla text-2xl font-semibold text-[#18181B]/80">"${elements.meaning ? elements.meaning : "অর্থ পাওয়া যায়নি"} / ${elements.pronunciation ? elements.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</p>
        <div class="flex justify-between pt-14 ">
        <button onclick="fetchWordDetails(${elements.id})" class="btn text-[#374957] bg-[#1A91FF]/10 p-4 rounded-xl hover:bg-[#1A91FF]/50">
            <i class="fa-solid fa-circle-info"></i>
        </button>
        <button onclick="(pronounceWord('${elements.word}'))" class="btn text-[#374957] bg-[#1A91FF]/10 p-4 rounded-xl hover:bg-[#1A91FF]/50">
            <i class="fa-solid fa-volume-high"></i>
        </button>
         </div>
     </div>
        `
        wordContainer.appendChild(newE);
    });
    load(false);
  }

const displayLessons = (lessons) =>{
    const lessonsContainer = document.getElementById("lesson-container")
    lessonsContainer.innerHTML="";
    lessons.forEach(lesson => {
    const newE = document.createElement('div');
    newE.innerHTML=`
    <button id="lessonBtn-${lesson.level_no}" onclick="fetchWords(${lesson.level_no})" class="btn btn-outline btn-primary all-btn"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no} </button>
    `
    lessonsContainer.appendChild(newE)

    })
    
}

document.getElementById('searchBtn').addEventListener('click',function (){
  const input =document.getElementById('searchInp').value.trim().toLowerCase()
  fetch('https://openapi.programming-hero.com/api/words/all')
  .then(res=>res.json())
  .then(data=> {
    const allWord = data.data;
    const filterWord = allWord.filter(word=>word.word.toLowerCase().includes(input))
    showWords(filterWord);
    removeCls()
  })
})

getLevels()
 
