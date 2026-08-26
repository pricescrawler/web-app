import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import api from '@services/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

function Feedback() {
  const { t } = useTranslation();
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.warning(t('pages.feedback.message-required'));

      return;
    }

    setSubmitting(true);

    try {
      await api.post('/api/v1/feedback', {
        type,
        message: message.trim(),
        email: email.trim() || null
      });
      toast.success(t('pages.feedback.success'));
      setMessage('');
      setEmail('');
    } catch (error) {
      toast.error(`${t('pages.feedback.error')} - (${error?.message ?? error})`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={'max-w-2xl mx-auto px-4 py-10'}>
      <div className={'text-center mb-8'}>
        <h2 className={'text-2xl font-bold tracking-tight'}>{t('menu.feedback')}</h2>
        <p className={'text-sm text-muted-foreground mt-2'}>{t('pages.feedback.subtitle')}</p>
      </div>

      <Card>
        <CardContent className={'p-5'}>
          <form
            className={'flex flex-col gap-4'}
            onSubmit={handleSubmit}
          >
            <div className={'flex flex-col gap-1.5'}>
              <Label htmlFor={'feedback-type'}>{t('pages.feedback.type')}</Label>
              <Select
                onValueChange={setType}
                value={type}
              >
                <SelectTrigger id={'feedback-type'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'suggestion'}>
                    {t('pages.feedback.types.suggestion')}
                  </SelectItem>
                  <SelectItem value={'bug'}>{t('pages.feedback.types.bug')}</SelectItem>
                  <SelectItem value={'other'}>{t('pages.feedback.types.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={'flex flex-col gap-1.5'}>
              <Label htmlFor={'feedback-message'}>{t('pages.feedback.message')}</Label>
              <Textarea
                id={'feedback-message'}
                maxLength={2000}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('pages.feedback.message-placeholder')}
                value={message}
              />
            </div>

            <div className={'flex flex-col gap-1.5'}>
              <Label htmlFor={'feedback-email'}>{t('pages.feedback.email')}</Label>
              <Input
                id={'feedback-email'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('pages.feedback.email-placeholder')}
                type={'email'}
                value={email}
              />
            </div>

            <Button
              className={'self-end'}
              disabled={submitting}
              type={'submit'}
            >
              {t('pages.feedback.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Feedback;
