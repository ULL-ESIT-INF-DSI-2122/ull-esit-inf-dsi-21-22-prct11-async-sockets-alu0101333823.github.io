/**
 * Type of the commands from the client 
 */
export type commandType = {
  cmd: 'add' | 'mod' | 'read' | 'list' | 'del';
  user: string;
  noteTitle?: string;
  body?: string;
  color?: string;
  newTitle?: string;
}
