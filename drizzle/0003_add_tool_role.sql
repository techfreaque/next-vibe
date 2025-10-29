-- Add TOOL role to chat_messages role enum
ALTER TYPE chat_message_role ADD VALUE IF NOT EXISTS 'tool';

