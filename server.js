'use stricts'

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const server = express();

server.use(cors());

const PORT = process.env.PORT;

server.use(express.json());


// mongoDB

const mongoose = require('mongoose');

main().catch(err => console.log(err));

let Book;

async function main() {
    // await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect('mongodb://localhost:27017/books');

    const bookSchema = new mongoose.Schema({
        title: String,
        description: String,
        status: String,
        email: String
    });

     Book = mongoose.model('Book', bookSchema);

    // seedData();
}

async function seedData(){
    const book1 = new Book({
        title: ' The Art of Asking',
        description: 'Is it okay to ask for help as an artist? Or should you sit back and meekly let things go by? Palmer answers these questions by sharing great stories from her career to show that it is, in fact, just fine to ask.',
        status: 'by Amanda Palmer',
        email: 'okoursuhaib@gmail.com'
    });

    const book2 = new Book({
        title: 'Down and Out in Paris and London',
        description: 'Orwell is known for his scary dystopian masterpiece, 1984, and his political commentary, Animal Farm, but his nonfiction is where all the life lessons are. Down and Out is a great story about his life in poverty, how he learned to cope with a world crumbling around him, and how he worked to get himself out of it. A powerful and encouraging read.',
        status: 'by George Orwell',
        email: 'okoursuhaib@gmail.com'
    });

    const book3 = new Book({
        title: ' Girls to the Front',
        description: 'Whether you’re a punk or not, this is a great book about the origin of a movement called Riot Grrrl and the impact it had on music and feminism. It showcases some of the upsides and downsides to early ’90s feminism, and also illustrates just how influential these female punk bands were for the future of music.',
        status: 'by Sara Marcus',
        email: 'okoursuhaib@gmail.com'
    });
    await book1.save();
    await book2.save();
    await book3.save();
}




// routes 
server.put('/updatebooks/:id',updateBooksHandler)

server.delete('/deleteBooks/:id',deleteBookHandler)

server.post('/addBooks',addBookHandler)

server.get('/getBooks', getBooksHandler);

server.get('/', homeHandler);




// functions

function homeHandler(req, res) {
    res.send('home page');
}

function getBooksHandler(req,res){
    let email=req.query.email;
    Book.find({email:email},(err,result)=>{
res.send(result);
    })
     
}


async function addBookHandler(req,res){
    const title = req.body.title;
    const description=req.body.description;
    const email=req.body.email;
    const status=req.body.status;

    await Book.create({
      title:title,
      description:description,
      email:email,
      status:status  
    })

    Book.find({email:email},(err,result)=>{
        res.send(result);
            })
}


function deleteBookHandler(req,res){
const bookId=req.params.id;
const email=req.query.email;
Book.deleteOne({_id:bookId},(err,result)=>{
    Book.find({email:email},(err,result)=>{
        res.send(result);
            })
})
}


function updateBooksHandler(req,res){
    const id = req.params.id;
    const {title,description,status,email}=req.body;

    Book.findByIdAndUpdate(id,{title,description,status,email},(err,result)=>{
        Book.find({email:email},(err,result)=>{
            res.send(result)
                })

    })
}

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

