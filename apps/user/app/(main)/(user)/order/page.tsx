'use client';

import { Display } from '@/components/display';
import { ProList, ProListActions } from '@/components/pro-list';
import { closeOrder, queryOrderList } from '@/services/user/order';
import { formatDate } from '@repo/ui/utils';
import { Button, buttonVariants } from '@shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn/ui/card';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';

export default function Page() {
  const t = useTranslations('order');

  const ref = useRef<ProListActions>(null);
  return (
    <ProList<API.OrderDetails, Record<string, unknown>>
      action={ref}
      request={async (pagination, filter) => {
        const response = await queryOrderList({ ...pagination, ...filter });
        return {
          list: response.data.data?.list || [],
          total: response.data.data?.total || 0,
        };
      }}
      renderItem={(item) => {
        return (
          <Card className='overflow-hidden'>
            <CardHeader className='bg-muted/50 flex flex-row items-center justify-between gap-2 space-y-0 p-3'>
              <CardTitle>
                {t('orderNo')}
                <p className='text-sm'>{item.orderNo}</p>
              </CardTitle>
              <CardDescription className='flex gap-2'>
                {item.status === 1 ? (
                  <>
                    <Link
                      key='payment'
                      href={`/payment?order_no=${item.orderNo}`}
                      className={buttonVariants({ size: 'sm' })}
                    >
                      {t('payment')}
                    </Link>
                    <Button
                      key='cancel'
                      size='sm'
                      variant='destructive'
                      onClick={async () => {
                        await closeOrder({ orderNo: item.orderNo });
                        ref.current?.refresh();
                      }}
                    >
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <Link
                    key='detail'
                    href={`/payment?order_no=${item.orderNo}`}
                    className={buttonVariants({ size: 'sm' })}
                  >
                    {t('detail')}
                  </Link>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className='p-3 text-sm'>
              <ul className='grid grid-cols-2 gap-3 *:flex *:flex-col lg:grid-cols-4'>
                <li>
                  <span className='text-muted-foreground'>{t('name')}</span>
                  <span>{item.subscribe.name || t(`type.${item.type}`)}</span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('paymentAmount')}</span>
                  <span>
                    <Display type='currency' value={item.amount} />
                  </span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('status.0')}</span>
                  <span>{t(`status.${item.status}`)}</span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('createdAt')}</span>
                  <time>{formatDate(item.created_at)}</time>
                </li>
              </ul>
            </CardContent>
          </Card>
        );
      }}
    />
  );
}
