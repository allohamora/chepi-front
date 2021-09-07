import { FC, useState, MouseEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Pizza } from 'src/services/pizza/types';
import { Card, Collapse, Typography, Table } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { PushpinOutlined, ShoppingOutlined } from '@ant-design/icons';
import { capitalize } from 'src/utils/string';
import { StyledCard, StyledModal, DescriptionImage } from './style';

const CLICK_IGNORE = 'click-ignore';

interface PizzaCardProps {
  pizza: Pizza;
  className?: string;
}

const { Meta } = Card;
const { Panel } = Collapse;

export const PizzaCard: FC<PizzaCardProps> = ({ pizza, className }) => {
  const [visible, setVisible] = useState(false);
  const {
    config: { language },
  } = useConfig();
  const { t } = useTranslation('pizza-card');
  const { image, variants } = pizza;

  const openModal = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(CLICK_IGNORE)) return;

    setVisible(true);
  };
  const closeModal = () => setVisible(false);

  const title = pizza[`${language}_title`];
  const descripton = pizza[`${language}_description`];

  const columns = [
    {
      title: `${capitalize(t('size'))} (${t('cm')})`,
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: `${capitalize(t('price'))} (${t('grn')})`,
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: `${capitalize(t('weight'))} (${t('gram')})`,
      dataIndex: 'weight',
      key: 'weight',
    },
  ];

  const data = variants.map((variant, i) => ({ key: i, ...variant }));

  return (
    <>
      <StyledCard
        className={className}
        cover={<img alt={title} src={image} />}
        actions={[
          <PushpinOutlined className={CLICK_IGNORE} key="pushin" />,
          <ShoppingOutlined className={CLICK_IGNORE} key="shopping" onClick={() => window.open(pizza.link)} />,
        ]}
        onClick={openModal}
        hoverable
      >
        <Meta title={title} description={descripton} />
      </StyledCard>

      <StyledModal title={title} visible={visible} onCancel={closeModal}>
        <Collapse defaultActiveKey={[3]}>
          <Panel header={t('image')} key={1}>
            <DescriptionImage src={image} alt={title} />
          </Panel>
          <Panel header={t('description')} key={2}>
            <Typography.Text>{descripton}</Typography.Text>
          </Panel>
          <Panel header={t('variants')} key={3}>
            <Table bordered columns={columns} dataSource={data} pagination={false} />
          </Panel>
        </Collapse>
      </StyledModal>
    </>
  );
};
