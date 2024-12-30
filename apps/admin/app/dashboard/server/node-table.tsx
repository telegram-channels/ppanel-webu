'use client';

import { Display } from '@/components/display';
import { ProTable, ProTableActions } from '@/components/pro-table';
import {
  batchDeleteNode,
  createNode,
  deleteNode,
  getNodeGroupList,
  getNodeList,
  updateNode,
} from '@/services/admin/server';
import { ConfirmButton } from '@repo/ui/confirm-button';
import { Badge } from '@shadcn/ui/badge';
import { Button } from '@shadcn/ui/button';
import { toast } from '@shadcn/ui/lib/sonner';
import { cn } from '@shadcn/ui/lib/utils';
import { Switch } from '@shadcn/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shadcn/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import NodeForm from './node-form';

export default function NodeTable() {
  const t = useTranslations('server.node');

  const [loading, setLoading] = useState(false);

  const { data: groups } = useQuery({
    queryKey: ['getNodeGroupList'],
    queryFn: async () => {
      const { data } = await getNodeGroupList();
      return (data.data?.list || []) as API.ServerGroup[];
    },
  });

  const ref = useRef<ProTableActions>();

  return (
    <ProTable<API.Server, { groupId: number; search: string }>
      action={ref}
      header={{
        toolbar: (
          <NodeForm<API.CreateNodeRequest>
            trigger={t('create')}
            title={t('createNode')}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createNode({ ...values, enable: false });
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
          accessorKey: 'id',
          header: 'ID',
          cell: ({ row }) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant='outline'
                    className={cn('text-primary-foreground', {
                      'bg-green-500': row.original.protocol === 'shadowsocks',
                      'bg-rose-500': row.original.protocol === 'vmess',
                      'bg-blue-500': row.original.protocol === 'vless',
                      'bg-yellow-500': row.original.protocol === 'trojan',
                    })}
                  >
                    {row.getValue('id')}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{row.original.protocol}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        },
        {
          accessorKey: 'enable',
          header: t('enable'),
          cell: ({ row }) => {
            return (
              <Switch
                checked={row.getValue('enable')}
                onCheckedChange={async (checked) => {
                  await updateNode({
                    ...row.original,
                    id: row.original.id!,
                    enable: checked,
                  } as API.UpdateNodeRequest);
                  ref.current?.refresh();
                }}
              />
            );
          },
        },
        {
          accessorKey: 'name',
          header: t('name'),
        },
        {
          accessorKey: 'server_addr',
          header: t('serverAddr'),
        },
        {
          accessorKey: 'speed_limit',
          header: t('speedLimit'),
          cell: ({ row }) => (
            <Display type='traffic' value={row.getValue('speed_limit')} unlimited />
          ),
        },
        {
          accessorKey: 'traffic_ratio',
          header: t('trafficRatio'),
          cell: ({ row }) => <Badge variant='outline'>{row.getValue('traffic_ratio')} X</Badge>,
        },

        {
          accessorKey: 'groupId',
          header: t('nodeGroup'),
          cell: ({ row }) => {
            const name = groups?.find((group) => group.id === row.getValue('groupId'))?.name;
            return name ? <Badge variant='outline'>{name}</Badge> : '--';
          },
        },
      ]}
      params={[
        {
          key: 'search',
        },
        {
          key: 'group_id',
          placeholder: t('nodeGroup'),
          options: groups?.map((item) => ({
            label: item.name,
            value: String(item.id),
          })),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getNodeList({
          ...pagination,
          ...filter,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
      actions={{
        render: (row) => [
          <NodeForm<API.Server>
            key='edit'
            trigger={t('edit')}
            title={t('editNode')}
            loading={loading}
            initialValues={row}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateNode({ ...row, ...values } as API.UpdateNodeRequest);
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
            description={t('deleteWarning')}
            onConfirm={async () => {
              await deleteNode({
                id: row.id,
              });
              toast.success(t('deleteSuccess'));
              ref.current?.refresh();
            }}
            cancelText={t('cancel')}
            confirmText={t('confirm')}
          />,
        ],
        batchRender(rows) {
          return [
            <ConfirmButton
              key='delete'
              trigger={<Button variant='destructive'>{t('delete')}</Button>}
              title={t('group.confirmDelete')}
              description={t('group.deleteWarning')}
              onConfirm={async () => {
                await batchDeleteNode({
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
