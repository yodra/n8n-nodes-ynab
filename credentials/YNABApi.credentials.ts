import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class YNABApi implements ICredentialType {
	name = 'ynabApi';
	displayName = 'YNAB API';
	documentationUrl = 'https://api.ynab.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Personal Access Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		}
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.token}}',
			},
		},
	};
}
