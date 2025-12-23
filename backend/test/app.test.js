const request = require('supertest');
const app = require('../app');


describe('API', ()=>{
it('GET /api/health', async ()=>{
const res = await request(app).get('/api/health');
expect(res.statusCode).toBe(200);
expect(res.body).toEqual({status:'ok'});
});


it('GET /api/tasks and POST /api/tasks', async ()=>{
const res1 = await request(app).get('/api/tasks');
expect(res1.statusCode).toBe(200);
const beforeLen = res1.body.length;


const res2 = await request(app).post('/api/tasks').send({title:'t1', description: 'd1'});
expect(res2.statusCode).toBe(201);
expect(res2.body).toHaveProperty('id');


const res3 = await request(app).get('/api/tasks');
expect(res3.body.length).toBe(beforeLen + 1);
});
});