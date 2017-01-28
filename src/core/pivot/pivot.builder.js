import {identity, uniq, groupBy} from 'core/services/utility';
import pivot from './pivot';
import view from './pivot.view';

function build(pivot, columnMap, pivotBy, valueFactory, level = 0) {
	if(pivotBy.length) {
		const key = pivotBy[0];
		const column = columnMap[key];
		const getValue = valueFactory(column);

		return pivot({
			factory: row => ({}),
			selector: row => [getValue(row)],
			name: identity,
			//value: () => 'X'
			// value: (group, row, pivot) =>
			// 	build(
			// 		pivot,
			// 		columnMap,
			// 		pivotBy.slice(1),
			// 		valueFactory,
			// 		level + 1)
		});
	}
	else{
		return 'x';
	}
}

export default function pivotBuilder(columnMap, pivotBy, valueFactory) {
	let doPivot = null;
	if (pivotBy.length) {
		doPivot =
			build(
				pivot,
				columnMap,
				pivotBy,
				valueFactory);
	}

	return rows => {
		if (doPivot) {
			const data = doPivot(rows);
			return view(data);
		}

		return null;
	};
}