import { useSuspenseQueries } from '@tanstack/react-query';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, type Equipment } from 'models/equipment';
import type { Reservation, Room } from 'models/reservation';
import { useGetReservationsQuery } from 'queries/useGetReservationsQuery';
import { useGetRoomsQuery } from 'queries/useGetRoomsQuery';
import { useState } from 'react';
import { getTimelinePercent, TIMELINE_HOURS } from 'models/timeline';

export const ReservationTimeline = ({ date }: { date: string }) => {
  const [{ data: reservations }, { data: rooms }] = useSuspenseQueries({
    queries: [useGetReservationsQuery(date), useGetRoomsQuery()],
  });

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  return (
    <div css={{ padding: '0 24px' }}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 현황
      </Text>
      <Spacing size={16} />

      <div css={{ background: colors.grey50, borderRadius: 14, padding: 16 }}>
        <div css={{ display: 'flex', alignItems: 'flex-end', marginBottom: 8 }}>
          <div css={{ width: 80, flexShrink: 0, paddingRight: 8 }} />
          <div css={{ flex: 1, position: 'relative', height: 18 }}>
            {TIMELINE_HOURS.map((hour: string) => (
              <Text
                key={hour}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={{
                  position: 'absolute',
                  left: `${getTimelinePercent(hour)}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  letterSpacing: -0.3,
                }}
              >
                {hour.slice(0, 2)}
              </Text>
            ))}
          </div>
        </div>
        {rooms.map((room, index) => (
          <RoomRow
            key={room.id}
            room={room}
            reservations={reservations.filter(reservation => reservation.roomId === room.id)}
            activeReservation={activeReservation}
            onToggle={id => setActiveReservation(id || null)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const RoomRow = ({
  room,
  reservations,
  activeReservation,
  onToggle,
  index,
}: {
  room: Room;
  reservations: Reservation[];
  activeReservation: string | null;
  onToggle: (id: string) => void;
  index: number;
}) => (
  <div
    css={{
      display: 'flex',
      alignItems: 'center',
      height: 32,
      ...(index > 0 && { marginTop: 4 }),
    }}
  >
    <div css={{ width: 80, flexShrink: 0, paddingRight: 8 }}>
      <Text typography="t7" fontWeight="medium" color={colors.grey700} ellipsisAfterLines={1} css={{ fontSize: 12 }}>
        {room.name}
      </Text>
    </div>
    <div
      css={{
        flex: 1,
        height: 24,
        background: colors.white,
        borderRadius: 6,
        position: 'relative' as const,
        overflow: 'visible' as const,
      }}
    >
      {reservations.map(reservation => (
        <ReservationBar
          key={reservation.id}
          reservation={reservation}
          roomName={room.name}
          isActive={activeReservation === reservation.id}
          onToggle={() => onToggle(activeReservation === reservation.id ? '' : reservation.id)}
        />
      ))}
    </div>
  </div>
);

const ReservationBar = ({
  reservation,
  roomName,
  isActive,
  onToggle,
}: {
  reservation: Reservation;
  roomName: string;
  isActive: boolean;
  onToggle: () => void;
}) => (
  <div
    css={{
      position: 'absolute',
      left: `${getTimelinePercent(reservation.start)}%`,
      width: `${getTimelinePercent(reservation.end) - getTimelinePercent(reservation.start)}%`,
      height: '100%',
    }}
  >
    <button
      type="button"
      aria-label={`${roomName} ${reservation.start}-${reservation.end} 예약 상세`}
      onClick={onToggle}
      css={{
        width: '100%',
        height: '100%',
        background: colors.blue400,
        borderRadius: 4,
        opacity: isActive ? 1 : 0.75,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
        border: 'none',
        padding: 0,
        '&:hover': { opacity: 1 },
      }}
    />
    {isActive && <ReservationTooltip reservation={reservation} />}
  </div>
);

const ReservationTooltip = ({ reservation }: { reservation: Reservation }) => (
  <div
    role="tooltip"
    css={{
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: 6,
      background: colors.grey900,
      color: colors.white,
      padding: '8px 12px',
      borderRadius: 8,
      fontSize: 12,
      whiteSpace: 'nowrap',
      zIndex: 10,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      lineHeight: 1.6,
    }}
  >
    <div>
      {reservation.start} ~ {reservation.end}
    </div>
    <div>{reservation.attendees}명</div>
    {reservation.equipment.length > 0 && (
      <div>{reservation.equipment.map((item: Equipment) => EQUIPMENT_LABELS[item]).join(', ')}</div>
    )}
  </div>
);
