echo "db.dropDatabase()" | mongosh fake_so
node init.js JoeAdministrator 1234
node populate_db.js mongodb://127.0.0.1:27017/fake_so
npm start