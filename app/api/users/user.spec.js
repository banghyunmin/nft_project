const should = require('should');
const request = require('supertest');
const app = require('../../app');
const models = require('../../models/models');

//user
describe('User Test Driven Development', () =>{
    const syncDatabase = require('../../../bin/sync-database');
    before('Sync test database', () =>{
        // sync database ...

        syncDatabase.model().then(() => {
            console.log('Test database sync');
        });
    });

    
    const testUsers = [
        {name: 'test1', pw: '111'},
        {name: 'test2', pw: '222'},
        {name: 'test3', pw: '333'}
    ];
    before('insert 3 users into database', (done) => {
        models.User.bulkCreate(testUsers).then(() => done());
    });

    after('Clear up test database', (done) => {
        models.User.drop();
        syncDatabase.model().then(() => done());
        console.log("after\n");
    });

    //read
    it('GET /users', (done) => {
        request(app)
            .get('/users')
            .expect(200)
            .end((err, res) => {
                if (err){
                    throw err;
                }

                // console.log("read\n");
                done();
            });
    });

    //read
    it('POST /users/:name', (done) => {
        request(app)
        .post('/users/test1')
	.send({
	    name: 'test1', pw: '111'
	})
        .expect(201)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });

    //update
    it('PUT /users/:name', (done) => {
        request(app)
        .put('/users/hana')
        .send({
	    name: 'foo', pw: '111'
        })
        .expect(200)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });

    //create
    it('POST /users', (done) => {
        request(app)
        .post('/users')
        .send({
	    name: 'test', pw: '222'
        })
        .expect(201)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });
    
    //destroy
    it('DELETE /users/:name', (done) => {
        request(app)
        .delete('/users/hana')
        .expect(204)
        .end((err, res) => {
            if(err){
                throw err;
            }
            done();
        });
    });
});


