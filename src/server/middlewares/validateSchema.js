import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { schemaErr } from '../utils/errors/schemaErr';
import authSchema from '../components/auth/authSchema';
import sourceSchema from '../components/source/sourceSchema';
import userSchema from '../components/user/userSchema';

const ajv = Ajv({ allErrors: true, jsonPointers: true });

ajvErrors(ajv);

ajv.addSchema(authSchema, 'auth');
ajv.addSchema(sourceSchema, 'source');
ajv.addSchema(userSchema, 'user');

/**
 * Validates incoming request body against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 */
function validateSchema(schemaName) {
	return (req, res, next) => {
		const valid = ajv.validate(schemaName, req.body);

		if (!valid) {
			const validationError = schemaErr(ajv.errors);
			return next(validationError);
		}

		return next();
	};
}

export { validateSchema };
