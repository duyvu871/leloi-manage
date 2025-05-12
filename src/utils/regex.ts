// Helper function to generate regex from a path
export const pathToRegex = (path: string): RegExp => {
	const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
	return new RegExp(escapedPath.replace(/\/:\w+/g, '/[^/]+'), 'i'); // Replace dynamic segments (e.g., ":id")
};

export const phoneRegex = new RegExp(
	/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);