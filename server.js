import express from 'express';
import bodyParser from 'body-parser';
import renderer from 'react-engine';
import r from "rethinkdb";
var WebSocketServer = require("ws").Server;



let options = { host: '172.17.0.1', port: 28015, db: 'twurl'};

let app = express();
let server = require('http').Server(app);
let engine = renderer.server.create();

app.use(createConnection);
app.use(bodyParser.json());

app.engine('.jsx', engine);
app.set('views', __dirname + '/public/views');
app.set('view engine', 'jsx');
app.set('view', renderer.expressView);

app.use(express.static(__dirname + '/public'));

server.listen(4000);

var wss = new WebSocketServer({server: server});

wss.on('connection', (ws) => {
  r.connect(options).then((conn) => {
    r.table('resources').changes().run(conn)
    .then((cursor) => cursor.each((err, {new_val}) => {
      ws.send(JSON.stringify(new_val));
    }));
  });
});

app.get('', index);
app.get('/tags', tagsPage);
app.put('/new', create);


function createConnection(req, res, next) {
  r.connect(options).then((conn) => {
    req._rdbConn = conn;
    next();
  }).error(handleError);;
}

function handleError(res) {
  return (error) => res.status(500).send({error: error.message});
}

function create(req, res, next) {
  let { url, tags } = req.body;

  let tagsArray = tags.split(', ');
  let resource = { url, tags: tagsArray };

   createResource(req, resource)
     .then(function(result) {
        if (result.inserted !== 1) {
          handleError(res, next)(new Error("Document was not inserted."));
        }
        else {
          res.status(200).send(JSON.stringify(result.changes[0].new_val));
        }})
     .error(handleError(res))
     .finally(next);
}

function getTags(req) {
  return r.table('resources')
  .concatMap((resource) => resource('tags'))
  .distinct()
  .run(req._rdbConn)
}

function getResources(req) {
  return r.table('resources')
  .run(req._rdbConn)
  .then((cursor) => cursor.toArray())
  .then((result) => {
    return {
      title: 'Resources',
      resources: result
    }
  });
}

function createResource(req, resource){
  return r.table('resources')
   .insert(resource, {returnChanges: true})
   .run(req._rdbConn)
}

function index(req, res, next){
  getResources(req)
    .then((result) => res.render('index', result))
    .error(handleError(res))
  .finally(next);
}

function tagsPage(req, res, next){
  getTags(req).then((result) => {
    res.render('tagsPage', {
      title: 'Twurl Tags',
      tags: result
    })
  }).error(handleError(res))
  .finally(next);
}

