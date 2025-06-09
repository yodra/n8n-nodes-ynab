import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import https from 'https';
import { YNABError } from '../YNABError';
import { YNABBudgetResponse } from '../YNABBudgetResponse';

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

		try {
			const response = await new Promise<YNABBudgetResponse>((resolve, reject) => {
				const options = {
					hostname: 'api.ynab.com',
					path: '/v1/budgets?include_accounts=false',
					method: 'GET',
					headers: {
						Authorization: `${apiKey.token ? `Bearer ${apiKey.token}` : ''}`,
						'Content-Type': 'application/json',
					},
				};

				const req = https.request(options, (res) => {
					let data = '';

					res.on('data', (chunk) => {
						data += chunk;
					});

					res.on('end', () => {
						if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
							resolve(JSON.parse(data));
						} else {
							const errorData = JSON.parse(data) as YNABError;
							reject(
								new Error(
									`Error getting budgets: ${errorData.error?.detail || res.statusMessage} / ${apiKey.toString()}`,
								),
							);
						}
					});
				});

				req.on('error', (error) => {
					reject(error);
				});

				req.end();
			});

			returnData.push({
				json: response,
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
