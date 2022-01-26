const app = require('../app/app');
const port = 3000;
const syncDatabase = require('./sync-database');


app.listen(port, () => {
    console.log('Tutorial app litensing on port 3000');

    syncDatabase.schedule().then(() => {
        console.log("Schedules Database sync");
    });
    syncDatabase.model().then(() => {
        console.log("Models Database sync");
    });
});
