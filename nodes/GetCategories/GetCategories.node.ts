import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionType,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import { IHttpRequestMethods } from 'n8n-workflow/dist/Interfaces';

export class GetCategories implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YNAB - Get Categories',
		name: 'getCategories',
		group: ['transform'],
		version: 1,
		description: 'YNAB Get Categories',
		icon: 'file:../../../icons/ynab.svg',
		defaults: {
			name: 'Get Categories',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'ynabApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Budget ID',
				name: 'budget_id',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'Budget identifier. Check your budgets to find the correct value.',
			},
		],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const returnData: INodeExecutionData[] = [];
		const items = this.getInputData();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const budgetId = this.getNodeParameter('budget_id', itemIndex, '') as string;
			const options = {
				method: 'GET' as IHttpRequestMethods,
				url: `https://api.ynab.com/v1/budgets/${budgetId}/categories`,
				json: true,
			};

			try {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ynabApi',
					options,
				);
				returnData.push({
					json: { response },
				});
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
