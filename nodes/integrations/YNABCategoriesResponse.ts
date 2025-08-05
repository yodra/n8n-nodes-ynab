import { IDataObject } from "n8n-workflow";

export interface YNABCategoriesResponse extends IDataObject {
	data: {
		categories: IDataObject[];
	};
}
