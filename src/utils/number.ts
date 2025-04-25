// import {
// 	InvalidFormatError,
// 	InvalidNumberError,
// 	NotEnoughUnitError,
// 	ReadingConfig,
// 	doReadNumber,
// } from 'read-vietnamese-number';

// // Config reading options
// const config = new ReadingConfig();
// config.unit = ['đồng'];

// export const readNumber = (number: string): string => {
// 	try {
// 		return doReadNumber(config, number);
// 	} catch (error: any) {
// 		if (error instanceof InvalidNumberError) {
// 			console.error('Invalid number:', error.message);
// 			return 'Invalid number';
// 		} else if (error instanceof InvalidFormatError) {
// 			console.error('Invalid format:', error.message);
// 			return 'Invalid format';
// 		} else if (error instanceof NotEnoughUnitError) {
// 			console.error('Not enough unit:', error.message);
// 			return 'Not enough unit';
// 		} else {
// 			console.error('Unknown error:', error.message);
// 		}
// 		return '';
// 	}
// }



