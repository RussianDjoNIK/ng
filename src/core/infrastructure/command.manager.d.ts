import {Command} from "./command";
import {IFunc} from "../dom/view";

export declare class CommandManager {
	constructor(public apply: IFunc);

	execute(commands: Command[]): boolean;

	keyDown(f: IFunc): EventListener;

	canExecute(): boolean;
}