import r from "rethinkdb";

let options = { host: '172.17.0.1', port: 28015, db: 'twurl'};

r.connect(options, (err, conn) => {
  r.table('resources')
   .concatMap((resource) => resource('tags'))
   .distinct()
   .run(conn, (err, res) => console.log(res.toArray()));
  conn.close();
});

