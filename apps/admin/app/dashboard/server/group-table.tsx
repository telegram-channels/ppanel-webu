'use client';

import { ProTable, ProTableActions } from '@/components/pro-table';
import {
  batchDeleteNodeGroup,
  createNodeGroup,
  deleteNodeGroup,
  getNodeGroupList,
  updateNodeGroup,
} from '@/services/admin/server';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { formatDate } from '@repo/ui/utils';
import { Button } from '@shadcn/ui/button';
import { toast } from '@shadcn/ui/lib/sonner';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import GroupForm from './group-form';

export default function GroupTable() {
  const t = useTranslations('server');
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>();

  return (
    <ProTable<API.ServerGroup, any>
      action={ref}
      header={{
        title: t('group.title'),
        toolbar: (
          <GroupForm<API.CreateNodeGroupRequest>
            trigger={t('group.create')}
            title={t('group.createNodeGroup')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createNodeGroup(values);
                toast.success(t('group.createdSuccessfully'));
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
          accessorKey: 'name',
          header: t('group.name'),
        },
        {
          accessorKey: 'description',
          header: t('group.description'),
          cell: ({ row }) => <p className='line-clamp-3'>{row.getValue('description')}</p>,
        },
        {
          accessorKey: 'updated_at',
          header: t('group.updatedAt'),
          cell: ({ row }) => formatDate(row.getValue('updated_at')),
        },
      ]}
      request={async () => {
        const { data } = await getNodeGroupList();
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      actions={{
        render: (row) => [
          <GroupForm<API.ServerGroup>
            key='edit'
            trigger={t('group.edit')}
            title={t('group.editNodeGroup')}
            loading={loading}
            initialValues={row}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateNodeGroup({
                  ...row,
                  ...values,
                });
                toast.success(t('group.createdSuccessfully'));
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
            trigger={<Button variant='destructive'>{t('group.delete')}</Button>}
            title={t('group.confirmDelete')}
            description={t('group.deleteWarning')}
            onConfirm={async () => {
              await deleteNodeGroup({
                id: row.id!,
              });
              toast.success(t('group.deletedSuccessfully'));
              ref.current?.refresh();
            }}
            cancelText={t('group.cancel')}
            confirmText={t('group.confirm')}
          />,
        ],
        batchRender(rows) {
          return [
            <ConfirmButton
              key='delete'
              trigger={<Button variant='destructive'>{t('group.delete')}</Button>}
              title={t('group.confirmDelete')}
              description={t('group.deleteWarning')}
              onConfirm={async () => {
                await batchDeleteNodeGroup({
                  ids: rows.map((item) => item.id),
                });
                toast.success(t('group.deleteSuccess'));
                ref.current?.refresh();
              }}
              cancelText={t('group.cancel')}
              confirmText={t('group.confirm')}
            />,
          ];
        },
      }}
    />
  );
}
