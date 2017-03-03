import View from 'core/view/view';
import * as css from 'core/services/css';
import * as columnService from 'core/column/column.service';
import log from 'core/infrastructure/log';

export default class LayoutView extends View {
	constructor(model, markup) {
		super(model);
		this.model = model;
		this.markup = markup;
		this.onInit();
	}

	onInit() {
		const model = this.model;

		model.viewChanged.watch(e => {
			if (!e || e.changes.hasOwnProperty('columns')) {
				this.invalidateColumns();
			}
		});

		model.layoutChanged.watch(e => {
			if (!e || e.changes.hasOwnProperty('columns')) {
				this.invalidateLayout();
				this.invalidateColumns();
			}

			if (!e || e.changes.hasOwnProperty('scroll')) {
				this.invalidateScroll();
			}
		});
	}

	invalidateLayout() {

	}

	invalidateScroll() {
		log.info('layout', 'invalidate scroll');

		const markup = this.markup;
		const scroll = this.model.layout().scroll;
		markup.head.scrollLeft = scroll.left;
		markup.foot.scrollLeft = scroll.left;
	}

	invalidateColumns() {
		log.info('layout', 'invalidate columns');

		const model = this.model;
		const getWidth = columnService.widthFactory(model);
		const columns = columnService
			.lineView(model.view().columns)
			.map(v => v.model);

		const style = {};
		let length = columns.length;
		while (length--) {
			const column = columns[length];
			const width = getWidth(column);
			if (null !== width) {
				const key = css.escape(column.key);
				style[`td.q-grid-${key}, th.q-grid-${key}`] = {
					'width': width,
					'min-width': width,
					'max-width': width
				};
			}
		}

		const id = model.grid().id;
		css.removeStyle(id);
		css.addStyle(id, style);
	}
}