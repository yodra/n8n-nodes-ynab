import {
	IExecuteFunctions, INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionType, NodeExecutionWithMetadata,
} from 'n8n-workflow';
import { IHttpRequestMethods } from 'n8n-workflow/dist/Interfaces';

export class GetBudgets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YNAB - Get Budgets',
		name: 'getBudgets',
		group: ['transform'],
		version: 1,
		description: 'YNAB Get Budgets',
		icon: 'file:icons/ynab.svg',
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

		return [returnData];
	}
}
