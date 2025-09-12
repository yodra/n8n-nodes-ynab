import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
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
		icon: 'file:../icons/ynab.svg',
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
		const apiKey = await this.getCredentials('ynabApi');
		const items = this.getInputData();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const budgetId = this.getNodeParameter('budget_id', itemIndex, '') as string;
			const options = {
				method: 'GET' as IHttpRequestMethods,
				url: `https://api.ynab.com/v1/budgets/${budgetId}/categories`,
				headers: {
					Authorization: `${apiKey.token ? `Bearer ${apiKey.token}` : ''}`,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			try {
				const response = this.helpers.request(options);
				returnData.push({
					json: { response },
				});
			} catch (error) {
				if (error instanceof Error) {
					throw Error(`Error getting budgets: ${error.message}`);
				}
				throw error;
			}
		}

		return [returnData];
	}
}
