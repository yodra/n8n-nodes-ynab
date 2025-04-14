import { INodeExecutionData, INodeType, INodeTypeDescription, NodeExecutionWithMetadata } from "n8n-workflow";

export class GetBudgets implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Get Budgets",
		name: "getBudgets",
		group: ["transform"],
		version: 1,
		description: "Get Budgets",
		defaults: {
			name: "Get Budgets",
		},
		inputs: ["main"],
		outputs: ["main"],
		properties: [],
	};

	execute(): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {


		return Promise.resolve(null);
	}
}
