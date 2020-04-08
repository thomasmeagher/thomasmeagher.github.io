import React, { useEffect, useState } from 'react'
import sa from 'gatsby-plugin-simple-analytics'

function useButtondown() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [message, setMessage] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/
        setIsValid(!!email && emailRegex.test(email))
    }, [email])

    const handleBlur = () => {
        setIsFocused(false)
    }
    const handleFocus = () => {
        setIsFocused(true)
    }
    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setEmail(value)
        if (isError) {
            setIsError(false)
            setMessage('')
        }
    }
    const handleSubmit = async (event) => {
        sa('submit_email')
        event.preventDefault()
        try {
            setIsSubscribed(false)
            setIsError(false)
            setIsLoading(true)
            const body = {
                email,
                referrer_url: 'tom.fm',
            }
            const response = await fetch(
                'https://api.buttondown.email/v1/subscribers',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${process.env.GATSBY_BUTTONDOWN_API_KEY}`,
                    },
                    body: JSON.stringify(body),
                },
            )
            if (response.ok) {
                setIsSubscribed(true)
                setMessage(
                    <div>
                        Subscribed{' '}
                        <span className="border-b border-dotted border-accent text-accent ">
                            {email}
                        </span>
                    </div>,
                )
                setEmail('')
            } else {
                setIsError(true)
                setMessage('Something went wrong')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        email,
        isError,
        isFocused,
        isLoading,
        isSubscribed,
        isValid,
        message,
        handleBlur,
        handleFocus,
        handleChange,
        handleSubmit,
    }
}

export default useButtondown
