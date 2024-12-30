'use client';

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementList,
  updateAnnouncement,
  updateAnnouncementEnable,
} from '@/services/admin/announcement';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { format } from '@shadcn/ui/lib/date-fns';
import { toast } from '@shadcn/ui/lib/sonner';
import { Switch } from '@shadcn/ui/switch';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { ProTable, ProTableActions } from '@/components/pro-table';
import { Button } from '@shadcn/ui/button';
import NoticeForm from './notice-form';

export default function Page() {
  const t = useTranslations('announcement');
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>();

  return (
    <ProTable<API.Announcement, { enable: boolean; search: string }>
      action={ref}
      header={{
        title: t('announcementList'),
        toolbar: (
          <NoticeForm<API.CreateAnnouncementRequest>
            trigger={t('create')}
            title={t('createAnnouncement')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createAnnouncement(values);
                toast.success(t('createSuccess'));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (error) {
                setLoading(false);
                return false;
              }
            }}
          />
        ),
      }}
      columns={[
        {
          accessorKey: 'enable',
          header: t('enable'),
          cell: ({ row }) => {
            return (
              <Switch
                defaultChecked={row.getValue('enable')}
                onCheckedChange={async (checked) => {
                  await updateAnnouncementEnable({
                    id: row.original.id,
                    enable: checked,
                  });
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'title',
          header: t('title'),
        },
        {
          accessorKey: 'content',
          header: t('content'),
        },
        {
          accessorKey: 'updated_at',
          header: t('updatedAt'),
          cell: ({ row }) => format(row.getValue('updated_at'), 'yyyy-MM-dd HH:mm:ss'),
        },
      ]}
      params={[
        {
          key: 'enable',
          placeholder: t('enable'),
          options: [
            { label: t('show'), value: 'false' },
            { label: t('hide'), value: 'true' },
          ],
        },
        { key: 'search' },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getAnnouncementList({
          ...pagination,
          ...filter,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      actions={{
        render(row) {
          return [
            <NoticeForm<API.Announcement>
              key='edit'
              trigger={t('edit')}
              title={t('editAnnouncement')}
              loading={loading}
              initialValues={row}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updateAnnouncement({
                    ...row,
                    ...values,
                  });
                  toast.success(t('updateSuccess'));
                  ref.current?.refresh();
                  setLoading(false);
                  return true;
                } catch (error) {
                  setLoading(false);
                  return false;
                }
              }}
            />,
            <ConfirmButton
              key='delete'
              trigger={<Button variant='destructive'>{t('delete')}</Button>}
              title={t('confirmDelete')}
              description={t('deleteDescription')}
              onConfirm={async () => {
                await deleteAnnouncement({
                  id: row.id,
                });
                toast.success(t('deleteSuccess'));
                ref.current?.refresh();
              }}
              cancelText={t('cancel')}
              confirmText={t('confirm')}
            />,
          ];
        },
        batchRender(rows) {
          return [
            <ConfirmButton
              key='delete'
              trigger={<Button variant='destructive'>{t('delete')}</Button>}
              title={t('confirmDelete')}
              description={t('deleteDescription')}
              onConfirm={async () => {
                for (const element of rows) {
                  await deleteAnnouncement({
                    id: element.id!,
                  });
                }
                toast.success(t('deleteSuccess'));
                ref.current?.refresh();
              }}
              cancelText={t('cancel')}
              confirmText={t('confirm')}
            />,
          ];
        },
      }}
    />
  );
}
