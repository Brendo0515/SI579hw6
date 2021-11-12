import App from './App';
function SynonymList(props) {
 //   console.log(`Rendered ${props.text}`);
    return(
        <li>{props.text} <button onClick={() => props.onDone(props.text)}>Save</button></li>
    );
}

export default SynonymList;