import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { roomKeys, reservationKeys } from 'queries/queryKeys';
import { Message, type MessageProps } from 'components/Message';
import { BookingFilter } from './components/BookingFilter';
import { AvailableRoomList } from './components/AvailableRoomList';
import { filterAvailableRooms } from 'models/roomFilter';
import { useCreateReservationMutation } from 'queries/useCreateReservationMutation';
import { PATHS } from 'pages/paths';
import { useBookingParams, type BookingParams } from './hooks/useBookingParams';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { params, updateParam } = useBookingParams();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);

  const [{ data: rooms }, { data: reservations }] = useSuspenseQueries({
    queries: [roomKeys.list, reservationKeys.list(params.date)],
  });

  const { mutateAsync: createMutation, isPending } = useCreateReservationMutation();

  const parsedFloor = params.preferredFloor === '' ? null : Number(params.preferredFloor);

  const isFilterValid =
    params.date && params.startTime && params.endTime && params.endTime > params.startTime && params.attendees >= 1;

  const availableRooms = isFilterValid
    ? filterAvailableRooms(rooms, reservations, {
        attendees: params.attendees,
        equipment: params.equipment,
        floor: parsedFloor,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
      })
    : [];

  const handleCreateBooking = async () => {
    if (!selectedRoomId) {
      setMessage({ type: 'error', text: '회의실을 선택해주세요.' });
      return;
    }

    try {
      const result = await createMutation({
        roomId: selectedRoomId,
        date: params.date,
        start: params.startTime,
        end: params.endTime,
        attendees: params.attendees,
        equipment: params.equipment,
      });

      if (result.ok) {
        navigate(PATHS.HOME, { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      setMessage({ type: 'error', text: result.message ?? '예약에 실패했습니다.' });
    } catch {
      setMessage({ type: 'error', text: '예약에 실패했습니다.' });
    }
    setSelectedRoomId(null);
  };

  const handleParamChange = useCallback(
    <K extends keyof BookingParams>(key: K, value: BookingParams[K]) => {
      setSelectedRoomId(null);
      setMessage(null);
      updateParam(key, value);
    },
    [updateParam]
  );

  return (
    <div css={{ background: colors.white, paddingBottom: 40 }}>
      <div css={{ padding: '12px 24px 0' }}>
        <button
          type="button"
          onClick={() => navigate(PATHS.HOME)}
          aria-label="뒤로가기"
          css={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: 14,
            color: colors.grey600,
            '&:hover': { color: colors.grey900 },
          }}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={{ paddingLeft: 24, paddingRight: 24 }}>예약하기</Top.Top03>

      {message && <Message type={message.type} text={message.text} />}

      <Spacing size={24} />

      <BookingFilter rooms={rooms} params={params} onChangeParam={handleParamChange} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterValid && (
        <AvailableRoomList
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          onCreateBooking={handleCreateBooking}
          isCreatingBooking={isPending}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
