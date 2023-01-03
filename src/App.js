import React,{ useState } from 'react';
import './App.css';
import Die from './components/Die';

function App() {
  const [dice,setDice] = useState(allNewDice())
  const [tenzies,setTenzies] = useState(false)
  const [rolls,setRolls] = useState(0)
  const [startTime,setStartTime] = useState(function(){
    return Date.now()
  })
  const [bestScore,setBestScore] = useState(function(){
    return localStorage.getItem("bestScore") || 0
  })
  function allNewDice(){
    
    const newDice = []
    for (let index = 0; index < 10; index++) {
      newDice.push({value: Math.floor(Math.random()*6 + 1) ,isHeld:false , id:index} )
    } 
    return newDice
  }

  function rollDice(){
    setRolls(prevRoles => prevRoles + 1)
    setDice(oldDice => {
      return oldDice.map(die => {
        return die.isHeld ? 
        die :{value: Math.floor(Math.random()*6 + 1) ,isHeld:false , id:die.id}

      })
    })
  }

  function holdDice(id){
    console.log(id)
    setDice(oldDice => {
      return oldDice.map(die => {
        return die.id === id ? {...die,isHeld:!die.isHeld} : die
      })
    })
  }

  React.useEffect(()=>{
    const allHeld = dice.every(die => die.isHeld)
    const firstDie = dice[0]
    const allEqual = dice.every(die => die.value === firstDie.value)
    if(allEqual && allHeld){
      setTenzies(true)
      const gameTime = (Date.now()-startTime)/1000
      if(gameTime < bestScore){
        setBestScore(gameTime)
        localStorage.setItem("bestScore",gameTime)
      }
    } 
  },[dice])

  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice = {()=>holdDice(die.id)}/>)
  return (
    <main>

      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <p className="rolls">Rolls: {rolls}</p>
      <p className="rolls">Best Score: {Math.floor(bestScore) + " seconds"}</p>
      <div className="dice-container">
        {diceElements}
      </div>
      {!tenzies && <button className="roll-dice" onClick={rollDice}>Roll</button>}
      {tenzies && <button className="play-again" onClick={()=>setDice(allNewDice())}>Play Again</button>}
    </main>
  );
}

export default App;
