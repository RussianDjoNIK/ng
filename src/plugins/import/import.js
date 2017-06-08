import PluginComponent from '../plugin.component';
import {IMPORT_NAME} from '../definition';
import {TemplatePath} from '@grid/core/template';
import {Command, EventListener, AppError} from '@grid/core/infrastructure';
import {columnFactory} from '@grid/core/column/column.factory';
import {generate} from '@grid/core/column-list';
import {Json} from '@grid/core/import/json';
import {Xlsx} from './xlsx';

function getType(name) {
	const dotDelimeter = /[.]/g.test(name);
	if (dotDelimeter) {
		let type = name.split('.');
		return type[type.length - 1];
	}
}

TemplatePath
	.register(IMPORT_NAME, () => {
		return {
			model: 'import',
			resource: 'content'
		};
	});

const Plugin = PluginComponent('import');
class Import extends Plugin {
	constructor() {
		super(...arguments);
		this.eventListener = new EventListener(this, this.$element[0]);
		this.upload = new Command({});
	}

	handleFile(e) {
		const files = e.target.files;
		const model = this.model;
		for (let file of files) {
			const reader = new FileReader();
			reader.onload = e => {
				const data = e.target.result;
				const type = file.type === '' ? getType(file.name) : file.type;
				switch (type) {
					case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
						const xlsx = new Xlsx();
						model.data(xlsx.read(data));
						break;
					}
					case 'json': {
						const json = new Json();
						const rows = json.read(data);
						if (rows.length) {
							model.data({
								rows: rows,
								columns: generate(rows, columnFactory(model), true)
							});
						} else {
							throw new AppError('Import plugin', 'JSON for input should be an array of objects');
						}
						break;
					}
					// case 'text/xml':
					// 	break;
					default: {
						throw new AppError('Import plugin', `This is not valid file type ${getType(file)}`);
					}
				}
			};
			reader.readAsBinaryString(file);
		}
	}

	get resource() {
		return this.model.import().resource;
	}

	onInit() {
		this.eventListener.on('change', this.handleFile);
	}

	onDestroy() {
		this.eventListener.off();
	}
}

export default Import.component({
	controller: Import,
	controllerAs: '$import',
	bindings: {
		'type': '@',
		'importOptions': '@'
	}
});