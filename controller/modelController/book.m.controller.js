const BookModel = require('../../model/book.model');
const book = require('../../routes/book.routs');

class BookModelController {
  static async getAllBook(offset = 1, limit = 1000, orderBy = '_id', groupBy = '_id') {
    const checkList = ['_id', 'title', 'date', 'author', 'description', 'image'];

    // Проверка на числа в параметрах для пагинации.
    if (isNaN(Number(offset)) || isNaN(Number(limit))) {
      throw new Error('Incorrect offset or limit query');
    }

    // Проверка на количество страниц.
    const pages = Math.ceil(await BookModel.countDocuments() / Number(limit));
    if (Number(offset) > pages) {
      throw new Error(`We have ${pages} pages`);
    }

    // Проверка на правильность параметра сортировки.
    if (!checkList.includes(orderBy)) {
      throw new Error('Please enter correct orderBy query');
    }

    // Создание query для группировки.
    const orderObj = {};
    groupBy.split(/,| |;/).forEach((i) => {
      if (!checkList.includes(i)) {
        throw new Error('Please enter correct groupBy query');
      }
      orderObj[i] = `$${i}`;
    });

    // Группировка
    const groupBook = await BookModel.aggregate(
      [
        { $group: { _id: orderObj } },
        { $sort: { [`_id.${orderBy}`]: 1 } },
        { $skip: (Number(offset) - 1) * Number(limit) },
        { $limit: Number(limit) },
      ],
    ).collation({ locale: 'en_US', numericOrdering: true });

    return groupBook;
  }

  static async getBookById(id) {
    const data = await BookModel.findById({ _id: id }).select('-__v').lean();

    if (!data) {
      throw new Error('Book not found!');
    }

    return data;
  }

  static async createBook(body) {
    const data = await BookModel.create(body);

    return data._id;
  }

  static async updateBookById(id, body) {
    const data = await BookModel.findOneAndUpdate({ _id: id }, body).lean();

    if (!data) {
      throw new Error('Book not found!');
    }

    return data._id;
  }

  static async deleteBookById(id) {
    const data = await BookModel.findOneAndDelete({ _id: id }).lean();

    if (!data) {
      throw new Error('Book not found!');
    }

    return null;
  }
}

module.exports = BookModelController;
