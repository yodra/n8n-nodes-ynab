import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import { IHttpRequestMethods } from 'n8n-workflow/dist/Interfaces';

export class GetBudgets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YNAB - Get Budgets',
		name: 'getBudgets',
		group: ['transform'],
		version: 1,
		description: 'YNAB Get Budgets',
		defaults: {
			name: 'Get Budgets',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'ynabApi',
				required: true,
			},
		],
		properties: [],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const returnData: INodeExecutionData[] = [];
		const apiKey = await this.getCredentials('ynabApi');
		const options = {
			method: 'GET' as IHttpRequestMethods,
			url: 'https://api.ynab.com/v1/budgets?include_accounts=false',
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

		return [returnData];
	}
}
