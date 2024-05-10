export const MACRO_ACTION_TYPES = [
  {
    key: 'assign_team',
    label: 'Atribuir um departamento',
    inputType: 'search_select',
  },
  {
    key: 'assign_agent',
    label: 'Atribuir um atendente',
    inputType: 'search_select',
  },
  {
    key: 'add_label',
    label: 'Adicionar uma etiqueta',
    inputType: 'multi_select',
  },
  {
    key: 'remove_label',
    label: 'Remover uma etiqueta',
    inputType: 'multi_select',
  },
  {
    key: 'remove_assigned_team',
    label: 'Remover Departamento Atribuído',
    inputType: null,
  },
  {
    key: 'send_email_transcript',
    label: 'Enviar uma transcrição por e-mail',
    inputType: 'email',
  },
  {
    key: 'mute_conversation',
    label: 'Silenciar conversa',
    inputType: null,
  },
  {
    key: 'snooze_conversation',
    label: 'Adiar conversa',
    inputType: null,
  },
  {
    key: 'resolve_conversation',
    label: 'Resolver conversa',
    inputType: null,
  },
  {
    key: 'send_webhook_event',
    label: 'Enviar Webhook',
    inputType: 'url',
  },
  {
    key: 'send_attachment',
    label: 'Enviar Anexo',
    inputType: 'attachment',
  },
  {
    key: 'send_message',
    label: 'Enviar uma mensagem',
    inputType: 'textarea',
  },
  {
    key: 'add_private_note',
    label: 'Adicionar uma nota privada',
    inputType: 'textarea',
  },
  {
    key: 'change_priority',
    label: 'Alterar Prioridade',
    inputType: 'search_select',
  },
];