import React from 'react'

import useButtondown from '@/hooks/use-buttondown'

const Form = () => {
    const {
        email,
        isLoading,
        message,
        isValid,
        handleBlur,
        handleFocus,
        handleChange,
        handleSubmit,
    } = useButtondown()

    return (
        <form className="mb-32 mt-10 max-w-sm pt-12" onSubmit={handleSubmit}>
            <div className="font-medium mb-1 text-muted text-sm">
                Get an email when I publish a new post
            </div>
            <div className="border-b flex py-2 w-full">
                <input
                    className="bg-transparent outline-none placeholder-muted pr-2 flex-1"
                    disabled={isLoading}
                    placeholder="email@address.com"
                    value={email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
                <button
                    className="text-body text-sm font-semibold"
                    disabled={isLoading || !isValid}
                >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </div>
            {message && (
                <div className="mt-2 text-muted text-xs">{message}</div>
            )}
        </form>
    )
}

export default Form