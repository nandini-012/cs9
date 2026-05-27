import Question
from '../models/question.model.js'

export async function createQuestion(req,res,next){
try{
const question =
await Question.create({

kind:
req.body.kind,

title:
req.body.title,

slug:
req.body.slug,

body:
req.body.body,

category:
req.body.category,

tags:
req.body.tags || [],

authorId:
req.body.authorId,

})

res.status(201).json({
success:true,
question
})

}catch(error){
next(error)
}
}

export async function getQuestions(req,res,next){
try{
const questions = await Question.find()
res.status(200).json({
success:true,
questions
})

}catch(error){
next(error)
}
}

export async function getQuestionById(req,res,next){
try{
const question =await Question.findById(req.params.id)

if(!question){
return res.status(404).json({
success:false,
message:
'Question not found'
})
}
res.status(200).json({
success:true,
question
})

}catch(error){
next(error)
}
}

export async function updateQuestion(req,res,next){
try{
const question = await Question.findByIdAndUpdate(

req.params.id,

 {
 title:
 req.body.title,

 body:
 req.body.body,

 category:
 req.body.category,

 tags:
 req.body.tags,
},

{
returnDocument:
'after'
}
)

if(!question){

return res.status(404).json({
success:false,
message:
'Question not found'
})

}

res.status(200).json({
success:true,
question
})

}catch(error){
next(error)
}
}

export async function deleteQuestion(req,res,next){
try{
    const question = await Question.findByIdAndDelete(req.params.id)

if(!question){

return res.status(404).json({
success:false,
message:
'Question not found'
})

}
res.status(200).json({
message:
'Question deleted'
})

}catch(error){
next(error)
}
}

export async function acceptAnswer(req,res,next){
try{
    const question = await Question.findByIdAndUpdate(
    req.params.id,
{
acceptedAnswerId:
req.params.answerId,

status:
'resolved'
},

{
returnDocument:'after'
}

)

if(!question){

return res.status(404).json({
success:false,
message:
'Question not found'
})

}
res.status(200).json({
message:
'Answer accepted'
})

}catch(error){
next(error)
}
}

export async function searchQuestions(req,res,next){
try{

const query =
req.query.q || ''

const questions =
await Question.find({

$text:{
$search:query
}

})

res.status(200).json({
success:true,
questions
})

}catch(error){
next(error)
}
}

export async function getQuestionsByCategory(req,res,next){
try{

const questions = await Question.find({

category:
req.query.category

})

res.status(200).json({
success:true,
questions
})

}catch(error){
next(error)
}
}