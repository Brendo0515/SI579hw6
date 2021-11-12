import SynonymList from './SynonymList'
import './App.css';
import { useState, useRef, useCallback, memo} from 'react';

const Memosynonymlist = memo(SynonymList);

function App() {
  let outputWords = [];
  let savedwordList = [];

  const inputText = useRef(null);
  //const [query, setQuery] = useState('')
  const [wordOutput, setwordOutput] = useState('(put output here)')
  const [outputDesc, setoutputDesc] = useState('(fill in the description)')
  const [savedWords, setsavedWords] = useState('(none)')

  const saveButton = useCallback(function (text) {
    savedwordList.push(text);
    setsavedWords(savedwordList.join(', '));
   }, []);

  async function getRhymes(){
    setwordOutput('...loading'); //shows "loading" text when items are still fetching
    const results = await fetch("https://api.datamuse.com/words?rel_rhy="+inputText.current.value);
    let data = await results.json();
    setoutputDesc('Words that rhyme with '+inputText.current.value+":");
  }

  async function getSynonyms(){
    console.log(inputText.current.value);
    setwordOutput('...loading'); //shows "loading" text when items are still fetching
    const results = await fetch("https://api.datamuse.com/words?ml="+inputText.current.value);
    let data = await results.json();
    setoutputDesc('Words with a similar meaning to '+inputText.current.value+":");
    if (data.length===0) {
      setwordOutput('No results');
    }
    else{
//      setwordOutput(data.map((item) => (<SynonymList text={item.word} />
//        )));
        for(let i = 0; i<data.length; i++) {
          const item = data[i];
          const elem = <Memosynonymlist onDone={saveButton} text={item.word} />;
          outputWords.push(elem);
        }
        setwordOutput(outputWords);
      }
    }

// function getSynonyms(){
//   console.log(inputText.current.value);
//   setwordOutput('...loading'); //shows "loading" text when items are still fetching
//   setoutputDesc('Words with a similar meaning to '+inputText.current.value+":");
//   fetch("https://api.datamuse.com/words?ml="+inputText.current.value).then((response) => {
//        return response.json();
//    }).then((data) => {
//      if (data.length===0) {
//        setwordOutput('No results');
//      }
//      else{
//          for(let i = 0; i<data.length; i++) {
//            const item = data[i];
//            const elem = <Memosynonymlist onDone={saveButton} text={item.word} />;
//            outputWords.push(elem);
//          }
//          setwordOutput(outputWords);
//
//        }
//    });
// }


  function onKeydown(event) {
    if(event.key === 'Enter') {
        getRhymes();
    }
  }

  
  return (
    <div>
      <div class="col">Saved words: <span id="saved_words">{savedWords}</span></div>
      <div class="input-group col">
        <input class="form-control" type="text" placeholder="Enter a word" id="word_input" onKeyDown={onKeydown} ref={inputText}/>
        <button id="show_rhymes" type="button" class="btn btn-primary" onClick={getRhymes} >Show rhyming words</button>
        <button id="show_synonyms" type="button" class="btn btn-secondary" onClick={getSynonyms} >Show synonyms</button>
      </div>
      <div class="row">
        <h2 class="col" id="output_description">{outputDesc}</h2>
      </div>
      <div class="output row">
        <output id = "word_output" class="col">{wordOutput}</output>
      </div>
    </div> 
  );
}

export default App;
