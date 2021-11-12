import WordList from './WordList'
import HeaderList from './HeaderList'
import './App.css';
import { useState, useRef, useCallback, memo} from 'react';

const Memowordlist = memo(WordList);
const Memoheaderlist = memo(HeaderList);

function App() {
  let outputWords = [];
  let savedwordList = [];

  const inputText = useRef(null);
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
    if (data.length===0) {
      setwordOutput('No results');
    }
    else{
      let syllableArray = groupBy(data, "numSyllables");
    //  let outputWords= (Object.keys(syllableArray)).map((num) => (<Memorhymelist text={num} /> ));
      for(let i = 0; i<(Object.keys(syllableArray)).length; i++) {
        const num = (Object.keys(syllableArray))[i];
        const elem = <Memoheaderlist text={num} />;
        outputWords.push(elem);
        let words = (syllableArray[num]).map((item) => (<Memowordlist onDone={saveButton} text={item.word} /> ));
        outputWords.push(words);
      }
      setwordOutput(outputWords);
    }
  }

  async function getSynonyms(){
    setwordOutput('...loading'); //shows "loading" text when items are still fetching
    const results = await fetch("https://api.datamuse.com/words?ml="+inputText.current.value);
    let data = await results.json();
    setoutputDesc('Words with a similar meaning to '+inputText.current.value+":");
    if (data.length===0) {
      setwordOutput('No results');
    }
    else{
      setwordOutput(data.map((item) => (<Memowordlist onDone={saveButton} text={item.word} /> )));
//        for(let i = 0; i<data.length; i++) {
//          const item = data[i];
//          const elem = <Memosynonymlist onDone={saveButton} text={item.word} />;
//          outputWords.push(elem);
//        }
//        setwordOutput(outputWords);
      }
    }

  function onKeydown(event) {
    if(event.key === 'Enter') {
        getRhymes();
    }
  }

  function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
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
