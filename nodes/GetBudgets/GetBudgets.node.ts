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
		displayName: 'Get Budgets',
		name: 'getBudgets',
		group: ['transform'],
		version: 1,
		description: 'Get Budgets',
		defaults: {
			name: 'Get Budgets',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		properties: [
			{
				displayName: 'API Key',
				name: 'apiKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				description: 'YNAB API Key',
			},
		],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			// const apiKey = await this.getCredentials('ynabApi');
			const apiKey = this.getNodeParameter('apiKey', i) as string;

			try {
				const response = await new Promise<YNABBudgetResponse>((resolve, reject) => {
					const options = {
						hostname: 'api.ynab.com',
						path: '/v1/budgets?include_accounts=false',
						method: 'GET',
						headers: {
							Authorization: `Bearer ${apiKey}`,
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
										`Error getting budgets: ${errorData.error?.detail || res.statusMessage}`,
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
		}

		return [returnData];
	}
}
