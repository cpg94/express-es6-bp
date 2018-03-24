import app from './app';
import db from './db';

const port = parseInt(process.env.PORT) || 3000;

db.connect('mongodb://localhost:27017/doggo').then((res) => {
	console.log('Connected to DB');
}).catch((err) => {
	console.log(err);
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});