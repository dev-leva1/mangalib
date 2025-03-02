// Middleware для валидации входящих данных
const validate = (schema) => (req, res, next) => {
  try {
    // Валидация тела запроса
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    }

    // Валидация параметров запроса
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    }

    // Валидация query-параметров
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate; 