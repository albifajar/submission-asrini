const {
  postBookHandler,
  getBookHandler,
  getBookOneHandler,
  putBookHandler,
  deleteBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookOneHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: putBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookHandler,
  },
];

module.exports = routes;
