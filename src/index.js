const app= require('./app')

app.get('/',(res,resp)=>{
    console.log('Health check done')
    resp.status(200).send({
        message:'Welcome to DSeller'
    })
})

app.listen(process.env.PORT || 80,()=>{
    console.log(`App Connected - ${process.env.PORT || 80}`)
})