/// <reference types="Cypress" />

describe('API Testing with Cypress', () => {
    beforeEach(() => {
        cy.request('/users/2').as('user');
    });

    it('should be able to print out the emails and headers by using cy.request', () => {
        cy.request('/users/2').then(response => {
            cy.log(JSON.stringify(response.body.data.email))
            cy.log(JSON.stringify(response.headers))
        });
    });

    it('API Tests - Validate the header', () => {
        // cy.request('/users/2').as('user');

        cy.get('@user')
            .its('headers')
            .its('content-type')
            .should('include', 'application/json; charset=utf-8');

        cy.get('@user').its('status').should('equal', 200);
        cy.get('@user').its('headers').its('connection').should('include', 'keep-alive');
    });

    it('API Tests - Status Codes', () => {
        cy.get('@user').its('status').should('equal', 200);

        cy.request({ url: '/users/non-exist', failOnStatusCode: false }).as('nonExistingUser');

        cy.get('@nonExistingUser').its('status').should('equal', 404);
    });

    it('API Tests - POST request', () => {
        cy.request({
            method: 'POST',
            url: '/login',
            // failOnStatusCode: false, // we need to set this to false, otherwise the test will fail
            body: {
                email: 'eve.holt@reqres.in',
                password: 'pistol',
            }
        }).as('loginRequest');

        
        cy.get('@loginRequest').its('status').should('equal', 200);
        cy.get('@loginRequest').then(req => {
            cy.log(req.body);
            expect(req.body).to.have.property('token');
            expect(req.body.token).to.not.be.null;
            expect(req.body.token).to.equal('QpwL5tke4Pnpja7X4');
        });
        

        // cy.get('@loginRequest').its('status').should('equal', 400);
        // cy.get('@loginRequest').then(res => {
        //     expect(res.body).to.have.property('error');
        //     expect(res.body.error).to.equal('Missing password');
        // });
    });

    it('API Tests - Delete request', () => {
        cy.request({
            method: 'DELETE',
            url: '/users/2'
        }).as('deleteUser');

        cy.get('@deleteUser').its('status').should('equal', 204);
    });

    it.only('API Tests - PUT request', () => {
        cy.request({
            method: 'PUT',
            url: '/users/2',
            body: {
                name: 'morpheus',
                auth: {
                    bearer: 'QpwL5tke4Pnpja7X4'
                }
            }
        }).as('putRequest');

        cy.get('@putRequest').its('status').should('equal', 200);
        cy.get('@putRequest').then(res => {
            expect(res.body.name).to.equal('morpheus');
        });
    });
});