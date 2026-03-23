import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes as ReactRouterRoutes, Navigate } from "react-router-dom";
import { ReservationStatusPage } from "./ReservationStatusPage";
import { RoomBookingPage } from "./RoomBookingPage";
import { Loading } from "components/Loading";
import { ErrorFallback } from "components/ErrorFallback";

export const Routes = () => {
	return (
		<ReactRouterRoutes>
			<Route
				path="/"
				element={
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Suspense fallback={<Loading />}>
							<ReservationStatusPage />
						</Suspense>
					</ErrorBoundary>
				}
			/>
			<Route
				path="/booking"
				element={
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Suspense fallback={<Loading />}>
							<RoomBookingPage />
						</Suspense>
					</ErrorBoundary>
				}
			/>
			<Route path="*" element={<Navigate replace to="/" />} />
		</ReactRouterRoutes>
	);
};
