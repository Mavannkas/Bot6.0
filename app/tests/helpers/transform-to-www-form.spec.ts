import { transformObjectToWWWForm } from '../../src/helpers/transform-to-www-form';

describe('transform-to-www-form test cases', () => {
	it('Should transform json to www-fotrm', () => {
		//Given
		const json = {
			p1: 'p1',
			p2: 'p2',
			p3: 'p3',
		};
		const exprectedResult = 'p1=p1&p2=p2&p3=p3';

		//When
		const result = transformObjectToWWWForm(json);

		//Should
		expect(result).toEqual(exprectedResult);
	});

    
});
