import { useRouter } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'
import { UserContext } from './UserContext'
import { useNavigate } from '@tanstack/react-router'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../helpers/SupabaseClient'

type ResumeProviderProps = {
	//   resumeId: number;
	children: React.ReactNode
}

export const UserProvider: React.FC<ResumeProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const navigate = useNavigate()
	const router = useRouter()
	const previousPath = useRef<string | null>(null)
	const userRef = useRef<User | null>(null)

	useEffect(() => {
		return router.subscribe('onResolved', (event) => {
			previousPath.current = event.fromLocation?.pathname ?? null
		})
	}, [router])

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setUser(data.session?.user ?? null)
			userRef.current = data.session?.user ?? null
		})

		// Whenever the auth state changes, we receive an event and a session object.
		// Save the user from the session object to the state.
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			// Supabase also fires SIGNED_IN on tab refocus when it silently
			// refreshes the session, not just on an actual login. Only navigate
			// when this is a genuine signed-out -> signed-in transition, otherwise
			// refocusing a tab bounces navigation between previousPath and here.
			const wasSignedOut = userRef.current === null

			setUser(session?.user ?? null)
			userRef.current = session?.user ?? null

			if (event === 'SIGNED_IN' && wasSignedOut) {
				if (previousPath.current) {
					navigate({ to: previousPath.current })
				}
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}
