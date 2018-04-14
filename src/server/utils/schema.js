/**
 * Format schema errors
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function formatSchemaErrors(schemaErrors) {
	const errors = schemaErrors.map(err => ({
		path: err.dataPath,
		message: err.message,
	}));

	return errors;
}

export { formatSchemaErrors };
