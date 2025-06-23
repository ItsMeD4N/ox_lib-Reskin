import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? 'rgba(235, 221, 203, 0.3)' : '#EBDDCB',
    whiteSpace: 'pre-wrap',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: '12px 10px',
    borderRadius: 0,
    background: 'rgba(15, 15, 15, 0.6)',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: params.readOnly ? 'rgba(15, 15, 15, 0.6)' : 'rgba(139, 0, 0, 0.5)',
      cursor: params.readOnly ? 'default' : 'pointer',
    },
    '&:active': {
      transform: params.readOnly ? 'none' : 'scale(0.99)',
    },
  },
  iconImage: {
    maxWidth: '25px',
    filter: 'sepia(0.3) saturate(0.8)',
  },
  description: {
    color: params.disabled ? 'rgba(235, 221, 203, 0.3)' : 'rgba(235, 221, 203, 0.6)',
    fontSize: 12,
    fontFamily: "'Roboto Condensed', sans-serif",
  },
  dropdown: {
    padding: 10,
    fontFamily: "'Cinzel', serif",
    color: '#EBDDCB',
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
    backgroundColor: 'rgba(20, 10, 10, 0.95)',
    border: '1px solid rgba(217, 182, 124, 0.4)',
  },
  buttonStack: {
    gap: 4,
    flex: '1',
  },
  buttonGroup: {
    gap: 10,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontWeight: 'bold',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    color: 'rgba(235, 221, 203, 0.6)',
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={300}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : undefined
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || !Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Icon" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ color: button.iconColor || 'rgba(235, 221, 203, 0.9)' }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress
                    value={button.progress}
                    size="xs"
                    color={button.colorScheme || 'red'}
                    styles={{ bar: { background: '#8B0000' }, root: { background: 'rgba(0,0,0,0.4)' } }}
                  />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <div key={`context-metadata-${index}`}>
                  <Text>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>
                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="xs"
                      color={metadata.colorScheme || button.colorScheme || 'red'}
                      styles={{ bar: { background: '#8B0000' }, root: { background: 'rgba(0,0,0,0.4)' } }}
                    />
                  )}
                </div>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map(([key, value], index) => (
                  <Text key={`context-metadata-${index}`}>
                    {key}: {value}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
