import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

function Question() {
  const [complete, setComplete] = useState(false)  // true if answered all questions
  const [contents, setContents] = useState([])     // to store questions
  const [ans, setAns] = useState([])               // to record your answers
  const [score, setScore] = useState(0)            // Your score
  const [current_question, setCurrentQuestion] = useState(0) // index to current question
  const [selected, setSelected] = useState("")

  const next = () => {
    // TODO : switch to the next question,
    // and check answers to set the score after you finished the last question
    if (current_question < contents.length){
      choose();
      setSelected("");
      setScore(0);
      setCurrentQuestion(current_question + 1);
      //console.log(ans);
      if (current_question === contents.length - 1){
        setComplete(true);
        getScore([...ans, selected]);
        //console.log(msg);

      }
    }
    /*else{
      console.log("here");
      choose();
      const msg = getScore([...ans, selected]);
      console.log(msg);
      if (msg !== "there is an error in answer sheet"){
        console.log("123")
        setScore(msg);
      }
    }*/
  }

  const getScore = async (myans) => {
    //console.log(myans);
    const {
      data: { message, score }
    } = await instance.get('/checkAns', {params: {myans}})
    
    if (message === "error")
      setScore(score);
    else if (message === "success")
      setScore(score);
  }
  const choose = () => {
    // TODO : update 'ans' for the option you clicked
    //ans_array[current_question];
    setAns([...ans, selected]);
  }

  const getQuestions = async () => {
    // TODO : get questions from backend
    const status = "init";
    const {
      data: { message, contents }
    } = await instance.get('/getContents', {params: {status}});
    if (message === "success"){
      setContents(() => contents.map((e) => {
        const newobj = {options: e.options, question: e.question};
        return newobj;
      }));
      setCurrentQuestion(0);
    }
  }


  useEffect(() => {
    if (!contents.length)
      getQuestions()
  })

  // TODO : fill in the rendering contents and logic
  return (
    <div id="quiz-container">
      {contents.length ?
        <React.Fragment>
          <div id="question-box">
            <div className="question-box-inner">
              {current_question < contents.length ? "Question " + (current_question + 1) + " of " + contents.length : "Question " + (contents.length) + " of " + contents.length}
            </div>
          </div>

          <div id="question-title">
            {current_question < contents.length ? contents[current_question].question : "Your Score : " + score + " / " + contents.length}
          </div>

          <div id="options">         
            {current_question < contents.length ? contents[current_question].options.map((e, index) => {
                return (<div className="each-option" key = {`q${current_question + 1}_${index + 1}`}>
                          <input type = "radio" id = {`q${current_question + 1}_${index + 1}`} name = {`option-${current_question}`} onChange = {(e) => setSelected(e.target.id.substr(3))}/>
                          <span>{e}</span>
                        </div>
                );
            }) : ""}
          </div>
          
          {current_question < contents.length ? <div id="actions" onClick={next}>
            NEXT
          </div> : ""}
        </React.Fragment>
        : <React.Fragment></React.Fragment>
      }
    </div>
  )
}

export default Question
