import { useSuspenseQueries } from '@tanstack/react-query';
import { Text, Spacing, ListRow, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, type Equipment } from 'models/equipment';
import type { Reservation } from 'models/reservation';
import { reservationKeys, roomKeys } from 'queries/queryKeys';

export const MyReservation = ({ onCancel }: { onCancel: (id: string) => Promise<void> }) => {
  const [{ data: myReservations }, { data: rooms }] = useSuspenseQueries({
    queries: [reservationKeys.my, roomKeys.list],
  });

  return (
    <div css={{ padding: '0 24px' }}>
      <div css={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {myReservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {myReservations.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {myReservations.length === 0 ? (
        <div
          css={{
            padding: '40px 0',
            textAlign: 'center' as const,
            background: colors.grey50,
            borderRadius: 14,
          }}
        >
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {myReservations.map(myReservation => {
            const roomName = rooms.find(room => room.id === myReservation.roomId)?.name ?? '';
            return (
              <MyReservationItem
                key={myReservation.id}
                myReservation={myReservation}
                roomName={roomName}
                onCancel={onCancel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const MyReservationItem = ({
  myReservation,
  roomName,
  onCancel,
}: {
  myReservation: Reservation;
  roomName: string;
  onCancel: (reservationId: string) => Promise<void>;
}) => {
  return (
    <div
      key={myReservation.id}
      css={{
        padding: '14px 16px',
        borderRadius: 14,
        background: colors.grey50,
        border: `1px solid ${colors.grey200}`,
      }}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={roomName}
            topProps={{
              typography: 't6',
              fontWeight: 'bold',
              color: colors.grey900,
            }}
            bottom={`${myReservation.date} ${myReservation.start}~${myReservation.end} · ${
              myReservation.attendees
            }명 · ${
              myReservation.equipment.map((item: Equipment) => EQUIPMENT_LABELS[item]).join(', ') || '장비 없음'
            }`}
            bottomProps={{
              typography: 't7',
              color: colors.grey600,
            }}
          />
        }
        right={
          <Button
            type="danger"
            style="weak"
            size="small"
            onClick={async e => {
              e.stopPropagation();
              if (window.confirm('정말 취소하시겠습니까?')) {
                await onCancel(myReservation.id);
              }
            }}
          >
            취소
          </Button>
        }
      />
    </div>
  );
};
