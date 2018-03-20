import app from './app';


const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});