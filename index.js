const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

/*
        - Query params => meusite.com/users?nome=eduarda&age=29 // FILTROS
        - Route params => /users/2    // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
        - Request Body => { "name":"Eduarda" , "age":}

        -GET            => Buscar informação no Back-end
        -POST           => Criar informação no Back-end
        -PUT            => Alterar/Atualizar informação no Back-end
        -DELETE         => Deletar informação no Back-end
        -Middleware     => interceptador - Tem o poder de parar ou alterar dados da requisição
        */


const users = []

const checkuserId = (request, response, next) => {
        const { id } = request.params

        const index = users.findIndex(user => user.id === id)

        if(index < 0){
                return response.status(404).json({ message: "User nor found"})
        }

        request.userIndex = index
        request.userid = id

        next()

}
app.get('/users', (request, response) => {
        return response.json(users)
})

app.post('/users', (request, response) => {
        const { name, age } = request.body
        
        const user = { id:uuid.v4(), name, age }

        users.push(user)

        return response.status(201).json(user)
})

app.put('/users/:id', checkuserId, (request, response) => {
      
        const { name, age } = request.body
        const index = request.userIndex
        const id = request.userId

        const updateUser = { id, name, age}
        
        users[index] = updateUser

        return response.json(updateUser)
})

app.delete('/users/:id',checkuserId, (request, response) => {
        const index = request.userIndex

        users.splice(index,1)


        return response.status(204).json()
})



app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`)
})