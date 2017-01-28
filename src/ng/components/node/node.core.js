import Directive from '../directive';
import TemplateCore from '../template/template.core';
import Command from 'core/infrastructure/command';
import {VIEW_CORE_NAME, NODE_CORE_NAME} from 'src/definition';

const toggleStatus = new Command({
	execute: node => node.state.expand = !node.state.expand,
	canExecute: node => node.type === 'group'
});

class NodeCore extends Directive(NODE_CORE_NAME, {view: `^^${VIEW_CORE_NAME}`}) {
	constructor($scope, $element, $compile, $templateCache) {
		super();

		this.$element = $element;
		this.$scope = $scope;
		this.template = new TemplateCore($compile, $templateCache);

		this.toggleStatus = toggleStatus;
		Object.defineProperty(this.$scope, '$view', {get: () => this.view});
	}

	onInit() {
		const state = this.view.model.node();
		const link = this.template.link(
			'qgrid.node.cell.tpl.html',
			state.resource
		);

		link(this.$element, this.$scope);
	}

	get count(){
		const node = this.$scope.$node;
		return node.children.length || node.rows.length;
	}

	get status() {
		return this.$scope.$node.state.expand ? 'expand' : 'collapse';
	}
}

NodeCore.$inject = [
	'$scope',
	'$element',
	'$compile',
	'$templateCache'
];

export default {
	restrict: 'A',
	bindToController: true,
	controllerAs: '$row',
	controller: NodeCore,
	require: NodeCore.require,
	link: NodeCore.link
};