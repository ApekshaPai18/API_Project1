const express = require("express");
const { get } = require("http");


//Database
const database =require("./database");


//initialize express

const booky = express();

/*
route             /
description       get all the books
access            public
parameter          none
methods           get
*/
//check whether it is connected
booky.get("/",(req,res)=>{
    return res.json({books:database.books});
}
);


/*
route             /
description       get specific book on ISBN
access            public
parameter          isbn
methods           get
*/
booky.get("/is/:isbn",(req,res)=>
{
    const getSpecificBook=database.books.filter(
        (book)=>book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length===0){
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
booky.get("/c/:category",(req,res)=>
{
    const getSpecificBook=database.books.filter(
        (book)=>book.category.includes(req.params.category)
    );
    if(getSpecificBook.length===0){
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
booky.get("/authors",(req,res)=>
{
    return res.json({authors:database.author});
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
booky.get("/publications",(req,res)=>
{
    return res.json({publications:database.publication});
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




booky.listen(4000,  () =>
{
    console.log("Server is up and running");
});


