import {
  OPERATOR_TYPES_1,
  OPERATOR_TYPES_2,
  OPERATOR_TYPES_3,
  OPERATOR_TYPES_6,
} from './operators';

export const AUTOMATIONS = {
  message_created: {
    conditions: [
      {
        key: 'message_type',
        name: 'Tipo da mensagem',
        attributeI18nKey: 'MESSAGE_TYPE',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'content',
        name: 'Contéudo da mensagem',
        attributeI18nKey: 'MESSAGE_CONTAINS',
        inputType: 'comma_separated_plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'email',
        name: 'Email',
        attributeI18nKey: 'EMAIL',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'inbox_id',
        name: 'Canal de Entrada',
        attributeI18nKey: 'INBOX',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'conversation_language',
        name: 'Idioma da conversa',
        attributeI18nKey: 'CONVERSATION_LANGUAGE',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'phone_number',
        name: 'Número do telefone',
        attributeI18nKey: 'PHONE_NUMBER',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_6,
      },
    ],
    actions: [
      {
        key: 'assign_agent',
        name: 'Associar a um atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'assign_team',
        name: 'Assoociar a um departamento',
        attributeI18nKey: 'ASSIGN_TEAM',
      },
      {
        key: 'add_label',
        name: 'Adicionar uma etiqueta',
        attributeI18nKey: 'ADD_LABEL',
      },
      {
        key: 'send_email_to_team',
        name: 'Enviar um email para o departamento',
        attributeI18nKey: 'SEND_EMAIL_TO_TEAM',
      },
      {
        key: 'send_message',
        name: 'Enviar uma mensagem',
        attributeI18nKey: 'SEND_MESSAGE',
      },
      {
        key: 'send_email_transcript',
        name: 'Enviar transcrição da conversa',
        attributeI18nKey: 'SEND_EMAIL_TRANSCRIPT',
      },
      {
        key: 'mute_conversation',
        name: 'Mutar a conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'snooze_conversation',
        name: 'Adiar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },

      {
        key: 'resolve_conversation',
        name: 'Resolver conversa',
        attributeI18nKey: 'RESOLVE_CONVERSATION',
      },
      {
        key: 'send_webhook_event',
        name: 'Enviar Webhookk',
        attributeI18nKey: 'SEND_WEBHOOK_EVENT',
      },
      {
        key: 'send_attachment',
        name: 'Enviar anexo',
        attributeI18nKey: 'SEND_ATTACHMENT',
      },
    ],
  },
  conversation_created: {
    conditions: [
      {
        key: 'status',
        name: 'Status',
        attributeI18nKey: 'STATUS',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'browser_language',
        name: 'Idioma do navegador',
        attributeI18nKey: 'BROWSER_LANGUAGE',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'mail_subject',
        name: 'Assunto do email',
        attributeI18nKey: 'MAIL_SUBJECT',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'country_code',
        name: 'País',
        attributeI18nKey: 'COUNTRY_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'phone_number',
        name: 'Número do  telefonne',
        attributeI18nKey: 'PHONE_NUMBER',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_6,
      },
      {
        key: 'referer',
        name: 'Link de  afiliado',
        attributeI18nKey: 'REFERER_LINK',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'email',
        name: 'Email',
        attributeI18nKey: 'EMAIL',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'inbox_id',
        name: 'Canal de entrada',
        attributeI18nKey: 'INBOX',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'conversation_language',
        name: 'Idioma da Conversa',
        attributeI18nKey: 'CONVERSATION_LANGUAGE',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'priority',
        name: 'Prioridade',
        attributeI18nKey: 'PRIORITY',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
    ],
    actions: [
      {
        key: 'assign_agent',
        name: 'Atribuir a um atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'assign_team',
        name: 'Atribuir a um departamento',
        attributeI18nKey: 'ASSIGN_TEAM',
      },
      {
        key: 'assign_agent',
        name: 'Atribuir um atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'send_email_to_team',
        name: 'Enviar email para o departamento',
        attributeI18nKey: 'SEND_EMAIL_TO_TEAM',
      },
      {
        key: 'send_message',
        name: 'Enviar mensagem',
        attributeI18nKey: 'SEND_MESSAGE',
      },
      {
        key: 'send_email_transcript',
        name: 'Enviar transcrição de conversa',
        attributeI18nKey: 'SEND_EMAIL_TRANSCRIPT',
      },
      {
        key: 'mute_conversation',
        name: 'Mutar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'snooze_conversation',
        name: 'Adiar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'resolve_conversation',
        name: 'Resolver conversa',
        attributeI18nKey: 'RESOLVE_CONVERSATION',
      },
      {
        key: 'send_webhook_event',
        name: 'Enviar webhook',
        attributeI18nKey: 'SEND_WEBHOOK_EVENT',
      },
      {
        key: 'send_attachment',
        name: 'Enviar anexo',
        attributeI18nKey: 'SEND_ATTACHMENT',
      },
    ],
  },
  conversation_updated: {
    conditions: [
      {
        key: 'status',
        name: 'Status',
        attributeI18nKey: 'STATUS',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'browser_language',
        name: 'Idioma do navegador',
        attributeI18nKey: 'BROWSER_LANGUAGE',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'mail_subject',
        name: 'Assunto do email',
        attributeI18nKey: 'MAIL_SUBJECT',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'country_code',
        name: 'País',
        attributeI18nKey: 'COUNTRY_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'referer',
        name: 'Link de afiliado',
        attributeI18nKey: 'REFERER_LINK',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'phone_number',
        name: 'Número do telefone',
        attributeI18nKey: 'PHONE_NUMBER',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_6,
      },
      {
        key: 'assignee_id',
        name: 'Destinatário',
        attributeI18nKey: 'ASSIGNEE_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_3,
      },
      {
        key: 'team_id',
        name: 'Departamento',
        attributeI18nKey: 'TEAM_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_3,
      },
      {
        key: 'email',
        name: 'Email',
        attributeI18nKey: 'EMAIL',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'inbox_id',
        name: 'Canal de entrada',
        attributeI18nKey: 'INBOX',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'conversation_language',
        name: 'Idioma da conversa',
        attributeI18nKey: 'CONVERSATION_LANGUAGE',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'priority',
        name: 'Prioridade',
        attributeI18nKey: 'PRIORITY',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
    ],
    actions: [
      {
        key: 'assign_agent',
        name: 'Atribuir um Atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'assign_team',
        name: 'Atribuir um departamento',
        attributeI18nKey: 'ASSIGN_TEAM',
      },
      {
        key: 'assign_agent',
        name: 'Atribuir Atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'send_email_to_team',
        name: 'Enviar email para um departamento',
        attributeI18nKey: 'SEND_EMAIL_TO_TEAM',
      },
      {
        key: 'send_message',
        name: 'Enviar mensagem',
        attributeI18nKey: 'SEND_MESSAGE',
      },
      {
        key: 'send_email_transcript',
        name: 'Enviar transcrição da conversa por email',
        attributeI18nKey: 'SEND_EMAIL_TRANSCRIPT',
      },
      {
        key: 'mute_conversation',
        name: 'Mutar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'snooze_conversation',
        name: 'Adiar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'resolve_conversation',
        name: 'Resolver conversa',
        attributeI18nKey: 'RESOLVE_CONVERSATION',
      },
      {
        key: 'send_webhook_event',
        name: 'Enviar webhook',
        attributeI18nKey: 'SEND_WEBHOOK_EVENT',
      },
      {
        key: 'send_attachment',
        name: 'Enviar anexo',
        attributeI18nKey: 'SEND_ATTACHMENT',
      },
    ],
  },
  conversation_opened: {
    conditions: [
      {
        key: 'browser_language',
        name: 'Idioma do Navegador',
        attributeI18nKey: 'BROWSER_LANGUAGE',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'email',
        name: 'Email',
        attributeI18nKey: 'EMAIL',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'mail_subject',
        name: 'Assunto do Email ',
        attributeI18nKey: 'MAIL_SUBJECT',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'country_code',
        name: 'País',
        attributeI18nKey: 'COUNTRY_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'referer',
        name: 'Link de Afiliado',
        attributeI18nKey: 'REFERER_LINK',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_2,
      },
      {
        key: 'assignee_id',
        name: 'Destinatário',
        attributeI18nKey: 'ASSIGNEE_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_3,
      },
      {
        key: 'phone_number',
        name: 'Número do Telefone',
        attributeI18nKey: 'PHONE_NUMBER',
        inputType: 'plain_text',
        filterOperators: OPERATOR_TYPES_6,
      },
      {
        key: 'team_id',
        name: 'Departamento',
        attributeI18nKey: 'TEAM_NAME',
        inputType: 'search_select',
        filterOperators: OPERATOR_TYPES_3,
      },
      {
        key: 'inbox_id',
        name: 'Canal de entrada',
        attributeI18nKey: 'INBOX',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'conversation_language',
        name: 'Idioma da Conversa',
        attributeI18nKey: 'CONVERSATION_LANGUAGE',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
      {
        key: 'priority',
        name: 'Prioridade',
        attributeI18nKey: 'PRIORITY',
        inputType: 'multi_select',
        filterOperators: OPERATOR_TYPES_1,
      },
    ],
    actions: [
      {
        key: 'assign_agent',
        name: 'Atribuir um Atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'assign_team',
        name: 'Atribuir um departamento',
        attributeI18nKey: 'ASSIGN_TEAM',
      },
      {
        key: 'assign_agent',
        name: 'Atribuir Atendente',
        attributeI18nKey: 'ASSIGN_AGENT',
      },
      {
        key: 'send_email_to_team',
        name: 'Enviar email para um departamento',
        attributeI18nKey: 'SEND_EMAIL_TO_TEAM',
      },
      {
        key: 'send_message',
        name: 'Enviar uma mensagem',
        attributeI18nKey: 'SEND_MESSAGE',
      },
      {
        key: 'send_email_transcript',
        name: 'Enviar transcrição da conversa por email',
        attributeI18nKey: 'SEND_EMAIL_TRANSCRIPT',
      },
      {
        key: 'mute_conversation',
        name: 'Mutar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'snooze_conversation',
        name: 'Adiar conversa',
        attributeI18nKey: 'MUTE_CONVERSATION',
      },
      {
        key: 'send_webhook_event',
        name: 'Enviar Webhook',
        attributeI18nKey: 'SEND_WEBHOOK_EVENT',
      },
      {
        key: 'send_attachment',
        name: 'Enviar Anexo',
        attributeI18nKey: 'SEND_ATTACHMENT',
      },
    ],
  },
};

export const AUTOMATION_RULE_EVENTS = [
  {
    key: 'conversation_created',
    value: 'Conversa criada',
  },
  {
    key: 'conversation_updated',
    value: 'Conversa atualizada',
  },
  {
    key: 'message_created',
    value: 'Mensagem Criada',
  },
  {
    key: 'conversation_opened',
    value: 'Conversa Aberta',
  },
];

export const AUTOMATION_ACTION_TYPES = [
  {
    key: 'assign_agent',
    label: 'Atribuir a um Atendente',
    inputType: 'search_select',
  },
  {
    key: 'assign_team',
    label: 'Atribuir a um Departamento',
    inputType: 'search_select',
  },
  {
    key: 'add_label',
    label: 'Adicionar etiqueta',
    inputType: 'multi_select',
  },
  {
    key: 'remove_label',
    label: 'Remove etiqueta',
    inputType: 'multi_select',
  },
  {
    key: 'send_email_to_team',
    label: 'Enviar email ao departamento',
    inputType: 'team_message',
  },
  {
    key: 'send_email_transcript',
    label: 'Enviar transcrição da conversa por email',
    inputType: 'email',
  },
  {
    key: 'mute_conversation',
    label: 'Mutar Conversa',
    inputType: null,
  },
  {
    key: 'snooze_conversation',
    label: 'Adiar Conversa',
    inputType: null,
  },
  {
    key: 'resolve_conversation',
    label: 'Resolver a Conversa',
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
    key: 'change_priority',
    label: 'Mudar Prioridade',
    inputType: 'search_select',
  },
  {
    key: 'add_sla',
    label: 'VAR',
    inputType: 'search_select',
  },
];