/// <reference types="cypress" />
import contratoU from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
         cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });
 
     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contratoU.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Thiago ${Math.floor(Math.random() * 10000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": usuario.substring(7, 12) + '@qa.com.br',
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Thiago Sousa', 'fulano@qa.com', 'teste', 'true')
          .then((response) => {
              expect(response.status).to.equal(400)
              expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[1]._id
               cy.request({
                   method: 'PUT', 
                   url: `usuarios/${id}`, 
                   body: 
                   {
                    "nome": 'Thiaguinho Sousa',
                    "email": 'thiago@qa.com.br',
                    "password": "novoteste",
                    "administrador": "false"
                     }
               }).then(response => {
                   expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
           })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `Thiago ${Math.floor(Math.random() * 10000)}`
          let email = usuario.substring(7, 12) + '@qa.com.br'
          cy.cadastrarUsuario(usuario, email, 'teste', 'true')
          .then(response => {
              let id = response.body._id
              cy.request({
                  method: 'DELETE',
                  url: `usuarios/${id}`
              }).then(response =>{
                  expect(response.body.message).to.equal('Registro excluído com sucesso')
                  expect(response.status).to.equal(200)
              })
          })
     });
});