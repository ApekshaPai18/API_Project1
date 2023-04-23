require("dotenv").config();

const express = require("express");
// const { get } = require("http");
const mongoose=require("mongoose");
var bodyParser=require("body-parser");

//Database
const database =require("./database/database");
const BookModel =require("./database/book");
const PublicationModel =require("./database/publication");
const AuthorModel =require("./database/author");



//initialize express

const booky = express();


booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,

{
    useNewUrlParser: true,
  
    
}
).then(()=>console.log("Connection Established"));

/*
route             /
description       get all the books
access            public
parameter          none
methods           get
*/
//check whether it is connected
booky.get("/",async(req,res)=>{
    const getAllBooks=await BookModel.find();

    return res.json(getAllBooks);
});




/*
route             /
description       get specific book on ISBN
access            public
parameter          isbn
methods           get
*/
booky.get("/is/:isbn",async(req,res)=>
{

  const getSpecificBook=await BookModel.findOne({ISBN:req.params.isbn});


     //null !0=1, !1=0
        if(!getSpecificBook){
        return res.json({error:`no book found for ISBN of ${req.params.isbn}`});

    }
    return res.json({book:getSpecificBook});

});


/*
route             /
description       get specific book on category
access            public
parameter         category
methods           get
*/
booky.get("/c/:category",async(req,res)=>
{
    const getSpecificBook= await BookModel.findOne({category:req.params.category});
    if(!getSpecificBook){
        return res.json({error:`no book found for category of ${req.params.category}`});
    }
    return res.json({book:getSpecificBook})
});


/*
route             /l
description       get specific book on languages
access            public
parameter         language
methods           get
*/
booky.get("/l/:language",(req,res)=>
{
    const getSpecificBook=database.books.filter(
        (book)=>book.language.includes(req.params.language)
    );
    if(getSpecificBook.length===0){
        return res.json({error:`no book found for language of ${req.params.language}`});
    }
    return res.json({book:getSpecificBook})
})



/*
route             /author
description       get all authors
access            public
parameter         none
methods           get
*/
booky.get("/authors",async(req,res)=>{
    const getAllAuthor=await AuthorModel.find();
    return res.json(getAllAuthor);

    
});


/*
route             /a
description       get all authors
access            public
parameter         none
methods           get
*/
booky.get("/author/:id",(req,res)=>
{
    const getSpecificAuthor=database.author.filter(
        (author)=>author.id === req.params.id
    );
    if(getSpecificAuthor.length===0){
        return res.json({error:`no author found of name ${req.params.id}`});
    }
    return res.json({author:getSpecificAuthor});
})





/*
route             /author/book
description       get all authors based on books
access            public
parameter         isbn
methods           get
*/

booky.get("/author/book/:isbn",(req,res)=>
{
    const getSpecificAuthor=database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length===0){
    return res.json({
        error:`no author found for the book of ${req.params.isbn}`
    });
}
    return res.json({authors:getSpecificAuthor});
})

/////////////////////////////////////////////////////////

//publication
booky.get("/publications",async(req,res)=>
{
    const getAllPublication=await PublicationModel.find();
    return res.json(getAllPublication); 
   
});

//////////////////////////////////////////////////
booky.get("/publications/:name",(req,res)=>
{
    const getSpecificPublication=database.publication.filter(
        (publication)=>publication.name === req.params.name
    );

    if(getSpecificPublication.length===0){
        return res.json({error:`no publication found for name  ${req.params.name}`});

    }
    return res.json({book:getSpecificPublication});

});
///////////////////////////////////////////////////////////////////
booky.get("/publications/:id",(req,res)=>
{
    const getSpecificPublication=database.publication.filter(
        (publication)=>publication.id === req.params.id
    );

    if(getSpecificPublication.length===0){
        return res.json({error:`no publication found for id of ${req.params.id}`});

    }
    return res.json({book:getSpecificPublication});

});

////////////////////////////
//based on books
booky.get("/publications/book/:isbn",(req,res)=>
{
    const getSpecificPublication=database.author.filter(
        (publication)=>publication.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length===0){
    return res.json({
        error:`no publication found for the book of ${req.params.isbn}`
    });
}
    return res.json({publication:getSpecificPublication});
})
////////////////////
 //post reuest

 /*
route             /book/new
description       add new book
access            public
parameter          none
methods           post
*/
booky.post("/book/new",async(req,res)=>{
    const{ newBook } =req.body;
    const addNewBook=BookModel.create(newBook);
    return res.json({
        books:addNewBook,
        message:"Book was added"

    });


   
 });


/////////////////////////

booky.post("/author/new",(req,res)=>{
    const {newAuthor}=req.body;
    const addNewAuthor=AuthorModel.create(newAuthor);
    return res.json({
        author:addNewAuthor,
        message:"Added new Author"
    });
   
});

///////////////////////////////////////////////

booky.post("/publication/new",(req,res)=>{
    const {newPublication}=req.body;
    const addNewPublication=PublicationModel.create(newPublication);
    return res.json(
        {
            publication:addNewPublication,
            message:"Added new publication"
        }
    );
});
/***************************PUT**********************/
booky.put("/book/update/:isbn",async(req,res)=>{

    const updatedBook=await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn

        },
        {
            title:req.body.bookTitle
        },
        {
            new:true
        }
    );
    return res.json({
        books:updatedBook
    });
});



/////////////update new author////////////
booky.put("/book/author/update/:isbn",async(req,res)=>{
    //update book database
    const updatedBook=await BookModel.findOneAndUpdate(
        {
        ISBN:req.params.isbn
        },
        {
            $addToSet:{
                authors:req.body.newAuthor
            }
        },
            {
                new:true
            }
        
    );
    //update the author database
    const updatedAuthor=await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }
    );
    return res.json({
        bookss:updatedBook,
        authors:updatedAuthor,
        message:"New Author was added"

    });
});





//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////////////put///////////

booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication
    database.publication.forEach((pub)=>{
        if(pub.id === req.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message:"Successfully updated publications"
        }
    );
});




/*
route            /book/delete
description       delete a book
access            public
parameter         isbn
methods           delete
*/
booky.delete("/book/delete/:isbn",async (req,res)=>{

    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    );
    return res.json(
        {
           books:updatedBookDatabase 
        });
      });


//delete author from book and released book from author
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList=book.author.filter(
                (eachAuthor)=>eachAuthor !== parseInt(req.params.authorId)
    );
            book.author = newAuthorList;
            return;
        }
    });

    //update author database
    database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id===parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book)=>book!==req.params.isbn
            );
            eachAuthor.books=newBookList;
            return;
            
        }
        return res.json({
            book:database.books,
            author:database.author,
            message:"Author was deleted!!!"
        });
    });

});






booky.listen(4000,  () =>
{
    console.log("Server is up and running");
});


