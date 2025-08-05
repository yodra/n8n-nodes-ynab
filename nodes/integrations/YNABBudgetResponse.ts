import { IDataObject } from "n8n-workflow";

export interface YNABBudgetResponse extends IDataObject {
	data: {
		budgets: IDataObject[];
	};
}
