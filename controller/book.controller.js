const BookModelController = require('./modelController/book.m.controller');

class BookController {
  static async getBooks(req, res) {
    try {
      const {
        offset, limit, orderBy, groupBy,
      } = req.query;

      const data = await BookModelController.getAllBook(offset, limit, orderBy, groupBy);

      res.status(200).json({ data });
      // res.send(`<img src="${data.image}" alt="">`);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  static async postBook(req, res) {
    try {
      const data = await BookModelController.createBook(req.body);

      res.status(201).json({ data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  static async getBook(req, res) {
    try {
      const { id } = req.params;
      const data = await BookModelController.getBookById(id);

      res.status(200).json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  static async updateBook(req, res) {
    try {
      const { id } = req.params;
      const data = await BookModelController.updateBookById(id, req.body);
      res.status(200).json({ data });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await BookModelController.deleteBookById(id);
      res.sendStatus(204);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = BookController;
