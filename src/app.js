import express from "express";
import cors from "cors";
import Joi from "joi";

const PORT = 5000;

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Validation
const userSchema = Joi.object({
	username: Joi.string().min(1).required(),
	avatar: Joi.string().uri().required(),
});

const tweetSchema = Joi.object({
	username: Joi.string().min(1).required(),
	tweet: Joi.string().min(1).required(),
});

const users = [];
const tweets = [];

server.post("/sign-up", (req, res) => {
	const user = req.body;
	const { error } = userSchema.validate(user);
	if (error) {
		res.status(400).send("Todos os campos são obrigatórios");
	} else {
		users.push(user);
		res.status(201).send("Usuário cadastrado com sucesso");
	}
});

server.post("/tweets", (req, res) => {
	const tweetText = req.body.tweet;
	const username = req.headers.user;
	if (!users.some((user) => user.username === username)) {
		res.status(401).send("UNAUTHORIZED");
		return;
	}
	const tweet = { username, tweet: tweetText };
	const { error } = tweetSchema.validate(tweet);
	if (error) {
		res.status(400).send("Todos os campos são obrigatórios");
	} else {
		tweets.push(tweet);
		res.status(201).send("Tweet enviado com sucesso");
	}
});

function fetchTweets(tweets, page = 1) {
	const sliceMin = (page - 1) * 10;
	const sliceMax = page * 10;
	const tweetsCopy = [...tweets].reverse();
	const fetchedTweets = tweetsCopy
		.slice(sliceMin, sliceMax)
		.map((tweet) => {
			const user = users.find((user) => user.username === tweet.username);
			return { ...tweet, avatar: user.avatar };
		});
	return fetchedTweets;
}

server.get("/tweets", (req, res) => {
	const page = req.query.page;
	if (page < 1) {
		res.status(400).send("Informe uma página válida!");
	}
	const fetchedTweets = fetchTweets(tweets, page);
	res.send(fetchedTweets);
});

server.get("/tweets/:username", (req, res) => {
	const username = req.params.username;
	const userTweets = tweets.filter((tweet) => tweet.username === username);
	const fetchedTweets = fetchTweets(userTweets);
	res.send(fetchedTweets);
});

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
