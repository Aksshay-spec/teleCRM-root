//app/leads/create/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DynamicField from '@/components/forms/DynamicField';

export default function CreateLeadPage() {
  const [form, setForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    const data = await apiFetch(`/forms/active?processType=LEAD`);
    setForm(data);
  };

  const handleSubmit = async () => {
    await apiFetch('/leads', {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
        data: formData,
      }),
    });

    alert('Lead created!');
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create Lead</h1>

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {form.fields.map((field: any) => (
        <DynamicField
          key={field.id}
          field={field}
          value={formData[field.key]}
          onChange={(val: any) =>
            setFormData({
              ...formData,
              [field.key]: val,
            })
          }
        />
      ))}

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
