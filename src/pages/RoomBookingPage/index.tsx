import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';
import { roomKeys, reservationKeys } from 'queries/queryKeys';
import { Message, type MessageProps } from 'components/Message';
import { bookingSchema, type BookingFormValues } from './bookingSchema';
import { BookingFilter } from './components/BookingFilter';
import { AvailableRoomList } from './components/AvailableRoomList';
import { filterAvailableRooms } from 'models/roomFilter';
import { useCreateReservationMutation } from 'queries/useCreateReservationMutation';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      date: searchParams.get('date') || formatYYYYMMDD(new Date()),
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
      attendees: Number(searchParams.get('attendees')) || 1,
      equipment: searchParams.get('equipment')
        ? (searchParams.get('equipment')!.split(',').filter(Boolean) as BookingFormValues['equipment'])
        : [],
      preferredFloor: searchParams.get('floor') || '',
    },
  });

  const {
    formState: { isValid },
  } = form;

  const [date, startTime, endTime, attendees, equipment, preferredFloor] = useWatch({
    control: form.control,
    name: ['date', 'startTime', 'endTime', 'attendees', 'equipment', 'preferredFloor'],
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(values => {
      setSelectedRoomId(null);
      setMessage(null);

      const params: Record<string, string> = {};
      if (values.date) params.date = values.date;
      if (values.startTime) params.startTime = values.startTime;
      if (values.endTime) params.endTime = values.endTime;
      if (values.attendees != null && values.attendees > 1) params.attendees = String(values.attendees);
      if (values.equipment?.length) params.equipment = values.equipment.join(',');
      if (values.preferredFloor) params.floor = values.preferredFloor;
      setSearchParams(params, { replace: true });
    });
    return () => unsubscribe();
  }, [form, setSearchParams]);

  const [{ data: rooms }, { data: reservations }] = useSuspenseQueries({
    queries: [roomKeys.list, reservationKeys.list(date)],
  });

  const { mutateAsync: createMutation, isPending } = useCreateReservationMutation();

  const parsedFloor = preferredFloor === '' ? null : Number(preferredFloor);

  const availableRooms = isValid
    ? filterAvailableRooms(rooms, reservations, {
        attendees,
        equipment,
        floor: parsedFloor,
        date,
        startTime,
        endTime,
      })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setMessage({ type: 'error', text: '회의실을 선택해주세요.' });
      return;
    }

    try {
      const result = await createMutation({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if (result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      setMessage({ type: 'error', text: result.message ?? '예약에 실패했습니다.' });
    } catch {
      setMessage({ type: 'error', text: '예약에 실패했습니다.' });
    }
    setSelectedRoomId(null);
  };

  return (
    <FormProvider {...form}>
      <div css={{ background: colors.white, paddingBottom: 40 }}>
        <div css={{ padding: '12px 24px 0' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
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

        <BookingFilter rooms={rooms} />

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {isValid && (
          <AvailableRoomList
            rooms={availableRooms}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            onBook={handleBook}
            isBooking={isPending}
          />
        )}

        <Spacing size={24} />
      </div>
    </FormProvider>
  );
}
