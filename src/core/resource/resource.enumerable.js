import {Resource} from './';

export class EnumerableResource extends Resource{
	constructor(data = {}, scope = {}, count = 0) {
		super(data, scope);

		this.count = count;
	}
}
