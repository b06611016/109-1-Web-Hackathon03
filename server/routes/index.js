import questionRoute from './question'

const wrap = fn => (...args) => fn(...args).catch(args[2])

function main(app) {
  app.get('/api/getContents', wrap(questionRoute.GetContents))
  app.get('/api/checkAns', wrap(questionRoute.CheckAns))
}

export default main
