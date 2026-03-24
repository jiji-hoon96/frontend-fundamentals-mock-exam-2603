import { Text, Spacing, ListRow, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from 'models/equipment';
import type { Room } from 'models/reservation';

interface Props {
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  onCreateBooking: () => void;
  isCreatingBooking: boolean;
}

export const AvailableRoomList = ({
  rooms,
  selectedRoomId,
  setSelectedRoomId,
  onCreateBooking,
  isCreatingBooking,
}: Props) => {
  return (
    <div css={{ padding: '0 24px' }}>
      <div css={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {rooms.length}개
        </Text>
      </div>
      <Spacing size={16} />

      {rooms.length === 0 ? (
        <div css={{ padding: '40px 0', textAlign: 'center' as const, background: colors.grey50, borderRadius: 14 }}>
          <Text typography="t6" color={colors.grey500}>
            조건에 맞는 회의실이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {rooms.map(room => {
            const isSelected = selectedRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                type="button"
                aria-pressed={isSelected}
                aria-label={room.name}
                css={{
                  cursor: 'pointer',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `2px solid ${isSelected ? colors.blue500 : colors.grey200}`,
                  background: isSelected ? colors.blue50 : colors.white,
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: isSelected ? colors.blue500 : colors.grey300 },
                }}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={room.name}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                        .map(eq => EQUIPMENT_LABELS[eq])
                        .join(', ')}`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={
                    isSelected ? (
                      <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                        선택됨
                      </Text>
                    ) : undefined
                  }
                />
              </button>
            );
          })}
        </div>
      )}

      <Spacing size={16} />
      <Button display="full" onClick={onCreateBooking} disabled={isCreatingBooking || !selectedRoomId}>
        {isCreatingBooking ? '예약 중' : '확정'}
      </Button>
    </div>
  );
};
