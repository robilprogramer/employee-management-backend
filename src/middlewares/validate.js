/**
 * Validation middleware factory
 * @param {Object} schema - Yup validation schema
 * @param {string} property - Request property to validate (body, params, query)
 */
const validate = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
      });
      
      req[property] = validated;
      next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
};

module.exports = { validate };
