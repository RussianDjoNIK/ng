import RootComponent from '../root.component';
import {pipeInvalidateFactory} from 'core/pipe/pipe.invalidate.factory';

export class Grid extends RootComponent {
	constructor($element, $transclude) {
		super('data', 'selection', 'sort', 'group', 'pivot', 'edit');

		this.$element = $element;
		this.$transclude = $transclude;
	}

	onInit() {
		let template = null;
		let templateScope = null;
		let invalidate = pipeInvalidateFactory(this.model);

		const invalidateList = ['pagination', 'sort', 'filter'];

		this.$transclude((clone, scope) => {
			template = clone;
			templateScope = scope;

			this.$element.append(clone);
		});

		template.remove();
		templateScope.$destroy();

		this.model.selectionChanged.on(e => {
			if (e.changes.hasOwnProperty('items')) {
				this.onSelectionChanged({
					$event: {
						state: this.model.selection()
					}
				});
			}
		});

		invalidateList
			.forEach(i =>
				this.model[i + 'Changed']
					.on(e => invalidate(i, e.changes)));

		invalidate('invalidate');
	}
}

Grid.$inject = ['$element', '$transclude'];

/**
 * By convention all binding should be named in camelCase like: modelname + [P]ropertyname
 */
export default {
	transclude: true,
	templateUrl: 'qgrid.grid.tpl.html',
	controller: Grid,
	controllerAs: '$grid',
	bindings: {
		model: '<',
		dataRows: '<rows',
		dataColumns: '<columns',
		dataPipe: '<pipe',
		selectionItems: '<selection',
		selectionMode: '<',
		onSelectionChanged: '&',
		groupBy: '<',
		pivotBy: '<',
		sortBy: '<',
		editMode: '<'
	}
};