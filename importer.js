import r from "rethinkdb";
import resources from './json/resources.json';
console.log(resources);

let options = { host: '172.17.0.22', port: 28015, db: 'twurl'};

r.connect(options, (err, conn) => {
  r.table('resources').insert(resources).run(conn, (err, res) => {
    console.log(resources.length);
  })
  conn.close();
});

