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

export class GetTransactions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YNAB - Get Transactions',
		name: 'getTransactions',
		group: ['transform'],
		version: 1,
		description: 'YNAB Get Transactions',
		icon: 'file:icons/ynab.svg',
		defaults: {
			name: 'Get Transactions',
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
				placeholder: '6906942e-b16e-4158-bfaa-b7a7d520e221',
				description: 'Budget identifier. Check your budgets to find the correct value.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'uncategorized',
				description: 'If specified, only transactions of the specified type will be included. The value should be uncategorized or unapproved.',
			},
			{
				displayName: 'Since Date',
				name: 'sinceDate',
				type: 'string',
				default: '',
				placeholder: '2024-12-30',
				description: 'If specified, only transactions on or after this date will be included. The date should be ISO formatted (e.g. 2016-12-30).',
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
			const type = this.getNodeParameter('type', itemIndex, '') as string;
			const sinceDate = this.getNodeParameter('sinceDate', itemIndex, '') as string;

			const queryParams = new URLSearchParams();
			if (type) {
				queryParams.append('type', type);
			}
			if (sinceDate) {
				queryParams.append('since_date', sinceDate);
			}

			const baseUrl = `https://api.ynab.com/v1/budgets/${budgetId}/transactions`;
			const queryString = queryParams.toString();

			const options = {
				method: 'GET' as IHttpRequestMethods,
				url: queryString ? `${baseUrl}?${queryString}` : baseUrl,
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
