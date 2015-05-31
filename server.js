import express from 'express';
import renderer from 'react-engine';
import r from "rethinkdb";

let options = { host: '172.17.0.1', port: 28015, db: 'twurl'};

let app = express();
let engine = renderer.server.create();

app.use(createConnection);
app.engine('.jsx', engine);
app.set('views', __dirname + '/public/views');
app.set('view engine', 'jsx');
app.set('view', renderer.expressView);

app.use(express.static(__dirname + '/public'));

app.get('', index);

app.listen(4000);

function createConnection(req, res, next) {
  r.connect(options).then((conn) => {
    req._rdbConn = conn;
    next();
  }).error(handleError);;
}

function handleError(res) {
  return (error) => res.send(500, {error: error.message});
}

function tags(req) {
  return r.table('resources')
  .concatMap((resource) => resource('tags'))
  .distinct()
  .run(req._rdbConn)
}

function index(req, res, next){
  tags(req).then((result) => {
    res.render('index', {
      title: 'Twurl',
      tags: result
    })
  }).error(handleError(res))
  .finally(next);
}

