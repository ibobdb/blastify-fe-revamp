'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'marketing' | 'notification' | 'personal';
}

// Sample templates
const SAMPLE_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'New Product Announcement',
    content:
      "Hello! We're excited to announce our new product: {product_name}. Get it now with a special {discount}% discount!",
    type: 'marketing',
  },
  {
    id: '2',
    name: 'Order Confirmation',
    content:
      'Your order #{order_id} has been confirmed and will be shipped on {ship_date}. Thank you for your purchase!',
    type: 'notification',
  },
  {
    id: '3',
    name: 'Follow-up Message',
    content:
      'Hi {name}, it was great talking to you about {topic}. I wanted to follow up on our conversation. Let me know if you have any questions!',
    type: 'personal',
  },
  {
    id: '4',
    name: 'Special Offer',
    content:
      "Don't miss out! Our {promotion_name} sale ends on {end_date}. Use code {code} to get {discount}% off your next purchase.",
    type: 'marketing',
  },
];

interface MessageTemplatePickerProps {
  onSelectTemplate: (template: string) => void;
}

export function MessageTemplatePicker({
  onSelectTemplate,
}: MessageTemplatePickerProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTemplates =
    selectedType === 'all'
      ? SAMPLE_TEMPLATES
      : SAMPLE_TEMPLATES.filter((template) => template.type === selectedType);

  return (
    <div className="w-full">
      <Tabs
        defaultValue="all"
        onValueChange={setSelectedType}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="notification">Notification</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
              >
                <div className="font-medium mb-2">{template.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.content}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => onSelectTemplate(template.content)}
                >
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
