export const transformObjectToWWWForm = (data: object): string => {
	return Object.entries(data)
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join('&');
};
