import {ColumnView} from './column.model.view';
import {DataColumnModel} from './data.column.model';
import {Model} from "../infrastructure/model";

export declare class IdColumnModel extends DataColumnModel {
	constructor();
}

export declare class IdColumn extends ColumnView {
	constructor(model: Model);

	static model(model: Model): Model;
}