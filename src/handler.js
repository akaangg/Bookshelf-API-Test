const nanoid = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author, summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = () => {
    if (pageCount === readPage) {
      return true;
    }
    return false;
  };
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name: String(name),
    year: Number(year),
    author,
    summary,
    publisher,
    pageCount: Number(pageCount),
    readPage: Number(readPage),
    reading: Boolean(reading),
    id,
    insertedAt,
    updatedAt,
    finished,
  };

  books.push(newBook);

  if (name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler=() => ({
  status: 'success',
  data: {
    books,
  },
});

const getBookByIdHandler=(request, h)=>{
  const {id}=request.params;

  const book=books.filter((n)=>n.id===id)[0];

  if (book!==undefined) {
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  const response=h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler=(request, h)=>{
  const {id} = request.params;

  const {
    name,
    year,
    author, summary, publisher, pageCount, readPage, reading}=request.payload;
  const updatedAt=new Date().toISOString();

  const index=books.findIndex((book)=>book.id===id);

  if (name==='') {
    const response=h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage>pageCount) {
    const response=h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index!==-1) {
    books[index] ={
      ...books[index],
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

    const response=h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler=(request, h)=>{
  const {id}=request.params;

  const index=books.findIndex((book)=>book.id===id);

  if (index !== -1) {
    books.splice(index, 1);
    const response=h.response({
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

module.exports={
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
