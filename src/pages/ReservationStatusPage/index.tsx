import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';
import { useDeleteReservationMutation } from 'queries/useDeleteReservationMutation';
import { Message, type MessageProps } from 'components/Message';
import { Loading } from 'components/Loading';
import { ErrorFallback } from 'components/ErrorFallback';
import { DateSelector } from './components/DateSelector';
import { MyReservation } from './components/MyReservation';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(formatYYYYMMDD(new Date()));
  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<MessageProps | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { mutateAsync: cancelMutation, isPending } = useDeleteReservationMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation(id);
      setMessage({
        type: 'success',
        text: '예약이 취소되었습니다.',
      });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  return (
    <div css={{ background: colors.white, paddingBottom: 40 }}>
      <Top.Top03 css={{ paddingLeft: 24, paddingRight: 24 }}>회의실 예약</Top.Top03>

      <Spacing size={24} />

      <DateSelector date={date} setDate={setDate} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {date && (
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[date]}>
          <Suspense fallback={<Loading message="예약 현황을 불러오는 중..." />}>
            <ReservationTimeline date={date} />
          </Suspense>
        </ErrorBoundary>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {message && <Message type={message.type} text={message.text} />}

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading message="내 예약을 불러오는 중..." />}>
          <MyReservation onCancel={handleCancel} />
        </Suspense>
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={{ padding: '0 24px' }}>
        <Button display="full" onClick={() => navigate('/booking')} disabled={isPending}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
