const { logger } = require('../utils/logger');

/**
 * Middleware для валидации входящих данных
 * @param {Object} schema - Joi схема для валидации
 * @param {String} source - Источник данных ('body', 'query', 'params')
 * @returns {Function} Middleware функция
 */
const validator = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    if (!schema) {
      return next();
    }
    
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Возвращает все ошибки, а не только первую
      stripUnknown: true, // Удаляет неизвестные поля
      errors: { 
        wrap: { 
          label: false // Не оборачивает имена полей в кавычки
        } 
      }
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      logger.warn(`Ошибка валидации: ${JSON.stringify(errorMessages)}`);
      
      return res.status(400).json({
        errors: errorMessages
      });
    }
    
    // Заменяем данные валидированными данными
    req[source] = value;
    next();
  };
};

module.exports = validator; 