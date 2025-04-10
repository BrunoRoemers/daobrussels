'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { claim } from '@/app/(frontend)/claim/actions'
import { toast } from 'sonner'

type ClaimButtonProps = {
  eventTitle: string
}

export default function ClaimButton({ eventTitle }: ClaimButtonProps) {
  const [userHash, setUserHash] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClaim = async () => {
    if (!userHash.trim()) {
      toast.error('Please enter something that you will remember')
      return
    }

    setIsLoading(true)
    try {
      const result = await claim(userHash)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Token claimed successfully!')
      }
    } catch (error) {
      console.error('Error claiming token:', error)
      toast.error('Failed to claim token. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter something that you will remember"
          className="w-full"
          value={userHash}
          onChange={(e) => setUserHash(e.target.value)}
        />
      </div>
      <Button className="w-full" size="lg" onClick={handleClaim} disabled={isLoading}>
        {isLoading ? 'Claiming...' : 'Claim Token'}
      </Button>
    </div>
  )
}
