/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
  }).should((response) => {
      expect(response.status).equal(200)
  })  

  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = faker.internet.email()
    cy.cadastrarUsuario('Fulano', email, 'teste', 'true')
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Fulano', 'fulano@qa.com', 'teste', 'true')
     .should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = faker.internet.email()
    cy.cadastrarUsuario('Fulano', email, 'teste', 'true')
        .then(response => {
          let id = response.body._id
          cy.request({
              method: 'PUT',
              url: `usuarios/${id}`,
              body: {
                  "nome": "Jose",
                  "email": email,
                  "password": "teste2",
                  "administrador": "false"
        }
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Registro alterado com sucesso')
    })

  });

});

it('Deve deletar um usuário previamente cadastrado', () => {
  let email = faker.internet.email()
  cy.cadastrarUsuario('Produto a ser deletado', email, 'senha', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,

        }).should(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
        
      })
});

});