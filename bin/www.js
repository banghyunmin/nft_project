const app = require('../app/app');
const port = 3000;
const syncDatabase = require('./sync-database');


app.listen(port, () => {
    console.log('Tutorial app litensing on port 3000');

    syncDatabase.board().then(() => {
        console.log("Boards Database sync");
    });
    syncDatabase.project().then(() => {
        console.log("Projects Database sync");
    });
    syncDatabase.guide().then(() => {
        console.log("Guides Database sync");
    });
    syncDatabase.schedule().then(() => {
        console.log("Schedules Database sync");
    });
    syncDatabase.model().then(() => {
        console.log("Models Database sync");
    });
});
