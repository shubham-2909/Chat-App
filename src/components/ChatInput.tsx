'use client'
import { FC } from 'react'
import { useState, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [input, setinput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [canPublish, setCanPublish] = useState<boolean>(true)
  const sendMessage = async () => {
    if (!input) return
    setIsLoading(true)
    try {
      await axios.post('/api/message/send', { text: input, chatId })
      setinput('')
      textAreaRef.current?.focus()
    } catch (error) {
      toast.error('Something went wrong plese try again')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={textAreaRef}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
            try {
              if (canPublish) {
                await axios.post('/api/message/typing', { chatId })
                setCanPublish(false)
                setTimeout(function () {
                  setCanPublish(true)
                }, 400)
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                console.log(error.response?.data)
              }
              console.log('Something went wrong')
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div
          onClick={() => textAreaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrin-0'>
            <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
