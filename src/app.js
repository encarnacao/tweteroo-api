import express from "express";
import cors from "cors";
import Joi from "joi";

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Validation
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    avatar: Joi.string().uri().required(),
})

const tweetSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    tweet: Joi.string().min(1).required(),
});

//Some users and tweets are already added as a mock test
const users = [
	{
		username: "bobesponja",
		avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info",
	},
	{
		username: "patolino",
		avatar: "https://i.pinimg.com/280x280_RS/04/b4/7d/04b47dd2b879ecca2e694e7b310bd2d3.jpg",
	},
	{
		username: "patoDonald",
		avatar: "http://images2.fanpop.com/images/photos/6000000/Donald-Duck-Icon-donald-duck-6040676-200-200.jpg",
	},
];
const tweets = [
	{
		username: "bobesponja",
		tweet: "eu amo o hub",
	},
    {
        username: "patolino",
        tweet: "eu odeio o hub",
    },
    {
        username: "patoDonald",
        tweet: "eu não sei o que é o hub",
    }
];

server.get("/", (req, res) => {
	res.send("Hello World");
});

server.post("/sign-up",(req,res)=>{
    const user = req.body;
    const {error} = userSchema.validate(user);
    if(error){
        res.status(400).send("Todos os campos são obrigatórios");
    } else{
        users.push(user);
        res.status(201).send("Usuário cadastrado com sucesso");
    }
})

server.post("/tweets",(req,res)=>{
    const tweet = req.body;
    const username = tweet.username;
    if(!users.some((user)=>user.username === username)){
        res.status(401).send("UNAUTHORIZED");
        return;
    }
    const {error} = tweetSchema.validate(tweet);
    if(error){
        res.status(400).send("Todos os campos são obrigatórios");
    } else{
        tweets.push(tweet);
        res.status(201).send("Tweet enviado com sucesso");
    }
});

server.listen(5000, () => {
	console.log("Servidor rodando na porta 5000");
});
