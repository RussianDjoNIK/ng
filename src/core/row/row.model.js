import {Resource} from '../resource';

export class RowModel {
	constructor() {
		this.resource = new Resource();

		this.mode = 'single'; //single|multiple
		this.unit = 'data'; //data|details
		this.height = 0;
		this.status = new Map();
	}
}