export interface iPark {
	id: string;
	name: string;
	image_url: string;
	description: string;
	latitude: number;
	longitude: number;
}

export interface iPlant {
	id: string;
	name: string;
	image_url: string;
	description: string;
	parks: iPark[];
	locations: {
		latitude: number;
		longitude: number;
	}[];
}
