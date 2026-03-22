import { colors } from '_tosslib/constants/colors';
import { Text } from '_tosslib/components';
import { Spacing } from '_tosslib/components';

export interface MessageProps {
  type: 'success' | 'error';
  text: string;
}

export const Message = ({ type, text }: MessageProps) => {
  const isSuccess = type === 'success';

  return (
    <div css={container}>
      <div css={messageStyle(isSuccess)}>
        <Text typography="t7" fontWeight="medium" color={isSuccess ? colors.blue600 : colors.red500}>
          {text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
};

const container = {
  padding: '0 24px',
};

const messageStyle = (isSuccess: boolean) => ({
  padding: '10px 14px',
  borderRadius: 10,
  background: isSuccess ? colors.blue50 : colors.red50,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});
