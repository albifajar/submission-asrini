const { nanoid } = require('nanoid');
const dataBooks = require('./books');

const getBookHandler = (request, h) => {
  const params = request.query;
  let data = dataBooks;

  if (params?.name) {
    data = data.filter((book) => book.name.toLowerCase().includes(params.name.toLowerCase()));
  }

  if (params?.reading) {
    data = data.filter((book) => book.reading === !!Number(params.reading));
  }

  if (params?.finished) {
    data = data.filter((book) => book.finished === !!Number(params.finished));
  }

  const responseReturn = {
    status: 'success',
    data: {
      books: data.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };

  const response = h.response(responseReturn);
  response.code(200);
  return response;
};

const getBookOneHandler = (request, h) => {
  const { id } = request.params;
  const book = dataBooks.filter((row) => row.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const postBookHandler = (request, h) => {
  const body = request.payload;

  body.id = nanoid(16);
  body.insertedAt = new Date().toISOString();
  body.updatedAt = body.insertedAt;
  body.finished = false;

  if (body.pageCount === body.readPage) {
    body.finished = true;
  } else if (body.readPage > body.pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!body?.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  dataBooks.push(body);

  const isSuccess = dataBooks.filter((book) => book.id === body.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: body.id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(400);
  return response;
};

const putBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = dataBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    dataBooks[index] = {
      ...dataBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;

  const index = dataBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    dataBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postBookHandler,
  getBookHandler,
  getBookOneHandler,
  putBookHandler,
  deleteBookHandler,
};
