function WordList(props) {
 //   console.log(`Rendered ${props.text}`);
    return(
        <li>{props.text} <button onClick={() => props.onDone(props.text)}>(save)</button></li>
    );
}

export default WordList;