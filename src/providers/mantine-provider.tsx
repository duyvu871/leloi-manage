'use client';
import React from 'react';
import { createTheme, Loader, MantineProvider } from '@mantine/core';
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import RingLoader from '@component/ui/loader';
dayjs().locale('vi')

const theme = createTheme({
	components: {
		Loader: Loader.extend({
			defaultProps: {
				loaders: { ...Loader.defaultLoaders, ring: RingLoader },
				type: 'ring',
			},
		}),
	},
});


interface MantineProviderProps {
	children: React.ReactNode;
}

export function MantineProviderClient({ children }: MantineProviderProps): JSX.Element {
	return (
		<MantineProvider forceColorScheme="light" theme={theme}>
			{children}
		</MantineProvider>
	);
}

export default MantineProvider;