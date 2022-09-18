import db from "./src/libs/db.js";
import app from "./src/app.js";

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await db.sync()
    console.log('Syncing database models')
} catch (error) {
    console.error('Unable to connect to the database:', error.message);
}

const port = process.env.HOST_PORT || 5000
app.listen(port, () => console.log(`Server running at port ${port}`));