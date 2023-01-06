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
})

const tweetSchema = Joi.object({
    username: Joi.string().min(1).required(),
    tweet: Joi.string().min(1).required(),
});

//Some users and tweets are already added as a mock test
const users = [];
const tweets = [];

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

function addAvatar(tweets, page=1){
    const sliceMin = (page-1)*10;
    const sliceMax = page*10;
    const tweetsCopy = [...tweets].reverse();
    const tweetsWithAvatars = tweetsCopy.slice(sliceMin, sliceMax).map((tweet)=>{
        const user = users.find((user)=>user.username === tweet.username);
        return {...tweet, avatar: user.avatar};
    });
    return tweetsWithAvatars
}

server.get("/tweets", (req, res) => {
    const page = req.query.page;
    if(page<1){
        res.status(400).send("Informe uma página válida!");
    }
    const tweetsWithAvatars = addAvatar(tweets, page);
    res.send(tweetsWithAvatars);
});

server.get("/tweets/:username",(req,res)=>{
    const username = req.params.username;
    const userTweets = tweets.filter((tweet)=>tweet.username === username);
    const tweetsWithAvatars = addAvatar(userTweets);
    res.send(tweetsWithAvatars);
});

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
