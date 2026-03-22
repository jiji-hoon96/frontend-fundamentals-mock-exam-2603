import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';
import { useDeleteReservationMutation } from 'queries/useDeleteReservationMutation';
import { Message, type MessageProps } from 'components/Message';
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

      {/* 날짜 선택 */}
      <DateSelector date={date} setDate={setDate} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <ReservationTimeline date={date} />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && <Message type={message.type} text={message.text} />}

      {/* 내 예약 목록 */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <MyReservation onCancel={handleCancel} />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={{ padding: '0 24px' }}>
        <Button display="full" onClick={() => navigate('/booking')} disabled={isPending}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
