import Question from '../models/question'
import Answer from '../models/answer'

exports.GetContents = async (req, res) => {
  // TODO : get questions from mongodb and return to frontend
  const sendData = (data, status) => {
    res.status(status).send({message : data[0], contents: data[1]});
  }
  if (req.query.status === "init"){
    console.log("db");
    Question.find().sort({_id: 1}).exec((err, res) =>{
      if (err || res.length === 0)
        sendData(["error", []], 403);
      else
        sendData(["success", res], 200);
    })
  }
}

exports.CheckAns = async (req, res) => {
  // TODO : get answers from mongodb,
  // check answers coming from frontend and return score to frontend
  const compare = (data1, data2, status) => {
    let correct = 0;
    if (status === 403 || data1.length !== data2.length)
      res.status(status).send({message: "error", score: -1});
    for (let i = 0; i < data1.length; ++i){
      //console.log(data1[i]);
      //console.log(data2[i]);
      if (parseInt(data1[i]) === data2[i].answer)
        ++correct;
    }
    //console.log(correct);
    res.status(status).send({message: "success", score: correct});
  }
  Answer.find().sort({_id: 1}).exec((err, res) => {
    if (err)
      compare(req.query.myans, res, 403);
    else{
      console.log(req.query.myans)
      compare(req.query.myans, res, 200);
    }
  })
}
