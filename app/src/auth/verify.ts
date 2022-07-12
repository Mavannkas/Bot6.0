import { Handler } from '../interfaces/default-handler';
import { FormatResponse } from '../response/format-response';

export const handler: Handler = async (event, context) => {
	return FormatResponse.start()
		.code(200)
		.json({
			test: 'test',
		})
		.build();
};
