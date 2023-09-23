const app= require('./app')

app.get('/',(res,resp)=>{
    resp.status(200).send({
        message:'Welcome to DSeller'
    })
})

app.listen(process.env.PORT,()=>{
    console.log('App Connected')
    console.log(process.env.PORT)
})