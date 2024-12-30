import useGlobalStore from '@/config/use-global';
import { sendEmailCode } from '@/services/common/common';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Markdown } from '@repo/ui/markdown';
import { Button } from '@shadcn/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@shadcn/ui/form';
import { Input } from '@shadcn/ui/input';
import { useForm } from '@shadcn/ui/lib/react-hook-form';
import { z, zodResolver } from '@shadcn/ui/lib/zod';
import { useCountDown } from 'ahooks';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useState } from 'react';
import CloudFlareTurnstile from './turnstile';

export default function UserRegisterForm({
  loading,
  onSubmit,
  initialValues,
  setInitialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  setInitialValues: Dispatch<SetStateAction<any>>;
  onSwitchForm: (type?: 'register' | 'reset') => void;
}) {
  const t = useTranslations('auth.register');
  const { common } = useGlobalStore();
  const { verify, register, invite } = common;

  const [targetDate, setTargetDate] = useState<number>();
  const [, { seconds }] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });
  const handleSendCode = async () => {
    await sendEmailCode({
      email: initialValues.email,
      type: 1,
    });
    setTargetDate(Date.now() + 60000);
  };

  const formSchema = z
    .object({
      email: z.string(),
      password: z.string(),
      repeat_password: z.string(),
      code: register.enable_email_verify ? z.string() : z.string().nullish(),
      invite: invite.forced_invite ? z.string() : z.string().nullish(),
      cf_token: verify.enable_register_verify ? z.string() : z.string().nullish(),
    })
    .superRefine(({ password, repeat_password }, ctx) => {
      if (password !== repeat_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('passwordMismatch'),
          path: ['repeat_password'],
        });
      }
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      invite: sessionStorage.getItem('invite'),
    },
  });

  return (
    <>
      {register.stop_register ? (
        <Markdown>{t('message')}</Markdown>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled placeholder='Enter your email...' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Enter your password...'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='repeat_password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Enter password again...'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {register.enable_email_verify && (
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center gap-2'>
                        <Input
                          disabled={loading}
                          placeholder='Enter code...'
                          type='text'
                          {...field}
                          value={field.value as string}
                        />
                        <Button type='button' onClick={handleSendCode} disabled={seconds > 0}>
                          {seconds > 0 ? `${seconds}s` : t('get')}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name='invite'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t('invite')}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {verify.enable_register_verify && (
              <FormField
                control={form.control}
                name='cf_token'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CloudFlareTurnstile id='register' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type='submit' disabled={loading}>
              {loading && <Icon icon='mdi:loading' className='animate-spin' />}
              {t('title')}
            </Button>
          </form>
        </Form>
      )}
      <div className='mt-4 text-right text-sm'>
        {t('existingAccount')}
        <Button
          variant='link'
          className='p-0'
          onClick={() => {
            setInitialValues(undefined);
            onSwitchForm(undefined);
          }}
        >
          {t('switchToLogin')}
        </Button>
      </div>
    </>
  );
}
