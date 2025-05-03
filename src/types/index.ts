export interface Message {
  role: 'user' | 'agent' | 'toolcallResult'
  content: string
}
export interface ToolResponse {
  success: boolean
  data?: string
  message: string
  format: 'json' | 'text' | 'markdown'
  call: string
}
