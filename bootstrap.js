import r from "rethinkdb";
import async from "async";

let options = { host: '172.17.0.22', port: 28015 };
let dbName = "twurl";

let createDb = (next) => {
  r.connect(options, (err, conn) => {
    r.dbCreate(dbName).run(conn, (err, res) => {
      conn.close();
      next(err, res);
    })
  });
};

connection.db = dbName;

let createTable = ({ name, primary_key }, next) => {
  r.connect(connection, (err, conn) => {
    r.tableCreate(name, { primary_key }).run(conn, (err, res) => {
      conn.close();
      next(err, res);
    });
  });
};

let createTables = (next) => {
  async.map([{ name: "resources", primary_key: "url"}], createTable, next);
};

async.series({
  created: createDb,
  tables: createTables
}, (err, res) => {
  console.log(res);
});
