import normalize from "emotion-normalize";
import { css, Global } from "@emotion/react";
import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalPortal } from "./GlobalPortal";

import "_tosslib/sass/app.scss";
import { PageLayout } from "pages/PageLayout";
import { Routes } from "pages/Routes";
import { Loading } from "components/Loading";
import { ErrorFallback } from "components/ErrorFallback";

export default function App() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<GlobalPortal.Provider>
				<Global
					styles={css`
            ${normalize}
            h1, h2, h3, h4, h5, h6 {
              font-size: 1em;
              font-weight: normal;
              margin: 0; /* or '0 0 1em' if you're so inclined */
            }
          `}
				/>
				<PageLayout>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Suspense fallback={<Loading />}>
							<Routes />
						</Suspense>
					</ErrorBoundary>
				</PageLayout>
			</GlobalPortal.Provider>
		</QueryClientProvider>
	);
}
