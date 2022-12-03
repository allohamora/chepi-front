import { FC, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Button, TableProps, Popconfirm, notification } from 'antd';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { useConfig } from 'src/providers/ConfigProvider';
import { getPizzas } from 'src/services/pizza';
import { capitalize } from 'src/utils/string';
import { unique } from 'src/utils/array';
import { Seo } from 'src/components/Seo';
import { AlertStatus } from 'src/components/AlertStatus';
import { join } from 'src/utils/url';
import { basePath } from 'src/config/url';
import { QuestionCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { Global, useTheme } from '@emotion/react';
import { useComparison } from 'src/providers/ComparisonProvider';
import { getColumns } from './columns';
import { getTableData } from './table-data';
import { getPizzasState } from './pizzas-state';
import { Buttons, StyledTable, Head, Type } from './style';

export type ComparisonType = 'own' | 'external';

interface Props {
  pizzasIds: string[];
  removePizzas: (...ids: string[]) => unknown;
  isReady: boolean;
  type: ComparisonType;
}

const COMPARISON_NOTIFICATION_CLASS = 'comparison-notification';

export const ComparisonContent: FC<Props> = ({ pizzasIds, removePizzas, isReady, type }) => {
  const { t } = useTranslation('comparison');
  const { t: tValue } = useTranslation('value');
  const { t: tProperty } = useTranslation('property');
  const {
    config: { language },
  } = useConfig();
  const theme = useTheme();
  const { setPizzas } = useComparison();

  const seo = <Seo title={t('title')} description={t('description')} />;
  const title = <Type>{capitalize(t(type))}</Type>;

  const { isLoading, error, data } = useQuery(
    [keys.pizzasByIds, pizzasIds],
    () => getPizzas({ ids: pizzasIds, limit: pizzasIds.length }),
    {
      keepPreviousData: true,
      enabled: isReady,
    },
  );

  useEffect(() => {
    if (data === undefined) return;

    const pizzas = data.data;

    if (pizzas.length !== pizzasIds.length) {
      const invalid = unique(
        pizzas.map(({ id }) => id),
        pizzasIds,
      );

      console.warn('some pizzas was not found', invalid);
      removePizzas(...invalid);
    }
  }, [data?.data]);

  if (isLoading || data === undefined || isReady === false) {
    return (
      <SearchLayout>
        {seo}
        {title}
        <AlertStatus status="loading" />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        {seo}
        {title}
        <AlertStatus status="error" />
      </SearchLayout>
    );
  }

  const { data: pizzas } = data;

  const state = getPizzasState(pizzas, language);

  const deletePizza = (id: string) => {
    removePizzas(id);
  };

  const tableColumns = getColumns({ t, tValue, tProperty }, state, deletePizza) as TableProps<object>['columns'];
  const tableData = getTableData(pizzas, language, tValue);

  const clearComparison = () => {
    removePizzas(...pizzasIds);
  };

  const shareHandler = async () => {
    const searchParams = new URLSearchParams(pizzasIds.map((id) => ['ids', id]));
    const query = searchParams.toString();

    await navigator.clipboard.writeText(join(basePath, `${language}/comparison/external?${query}`));

    notification.open({
      message: t('copied'),
      icon: <SmileOutlined style={{ color: theme.colors.primary }} />,
      placement: 'bottomRight',
      className: COMPARISON_NOTIFICATION_CLASS,
    });
  };

  const replaceList = async () => {
    setPizzas(...pizzasIds);

    notification.open({
      message: t('replaced'),
      icon: <SmileOutlined style={{ color: theme.colors.primary }} />,
      placement: 'bottomRight',
      className: COMPARISON_NOTIFICATION_CLASS,
    });
  };

  return (
    <SearchLayout>
      {seo}
      {pizzas.length > 0 && (
        <>
          <Global
            styles={`
              .${COMPARISON_NOTIFICATION_CLASS} {
                .ant-notification-notice-with-icon {
                  display: flex;
                  align-items: center;
                }

                .ant-notification-notice-message {
                  padding: 0;
                  margin-right: 0;
                }

                .ant-notification-notice-description {
                  display: none;

                  margin: 0;
                }

                .ant-notification-notice-content {
                  margin-right: 0;
                }

                .ant-notification-notice-close {
                  display: none;
                }
              }
            `}
          />
          <Head>
            {title}

            <Buttons>
              <Button onClick={shareHandler} type="ghost">
                {capitalize(t('share'))}
              </Button>

              {type === 'external' && (
                <Popconfirm
                  onConfirm={replaceList}
                  title={t('replace-message')}
                  icon={<QuestionCircleOutlined style={{ color: theme.colors.danger }} />}
                >
                  <Button type="ghost">{capitalize(t('replace'))}</Button>
                </Popconfirm>
              )}

              <Popconfirm
                onConfirm={clearComparison}
                title={t('clear-message')}
                icon={<QuestionCircleOutlined style={{ color: theme.colors.danger }} />}
              >
                <Button type="ghost" danger>
                  {capitalize(t('table.clear'))}
                </Button>
              </Popconfirm>
            </Buttons>
          </Head>

          <StyledTable columns={tableColumns} dataSource={tableData} scroll={{ x: 0 }} pagination={false} bordered />
        </>
      )}

      {pizzas.length === 0 && (
        <>
          {title}
          <Alert message={capitalize(t('comparison-empty'))} type="info" showIcon />
        </>
      )}
    </SearchLayout>
  );
};
