import { Link } from 'gatsby'

import { useMount } from 'react-use'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import sa from 'gatsby-plugin-simple-analytics'

import { MDXProvider } from '@mdx-js/react'

import React, { FC, useEffect, useRef, useState } from 'react'

import { useStore } from '@/store'
import CopyEmailButton from '@/components/copy-email-button'
import Thanks from '@/components/thanks'

const shortcodes = { CopyEmailButton, Thanks }

interface Props {
    post: Post
}

const Post: FC<Props> = ({
    post: {
        body,
        fields: { slug },
        frontmatter: { date, title },
    },
}) => {
    const [isUpdatingTweets, setIsUpdatingTweets] = useState(true)
    const articleEl = useRef<HTMLElement>(null)
    const { appearance } = useStore()
    const click = (title: string) => {
        sa(`click_post_${title}`)
    }
    useMount(() => setIsUpdatingTweets(false))
    useEffect(() => {
        if (window.twttr?.widgets && !isUpdatingTweets) {
            const tweetElements = articleEl.current?.querySelectorAll(
                '.twitter-tweet',
            ) as NodeListOf<HTMLElement>
            setIsUpdatingTweets(true)
            tweetElements?.forEach(async (t) => {
                t.style.opacity = '0'
                await window.twttr?.widgets.createTweet(
                    t.dataset.tweetId,
                    t.parentElement,
                    {
                        dnt: true,
                        theme: appearance,
                    },
                )
                t.remove()
            })
            setIsUpdatingTweets(false)
        }
    }, [appearance]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <MDXProvider components={shortcodes}>
            <article className="my-12" ref={articleEl}>
                <header className="flex items-center justify-between mb-3">
                    <h1 className="font-medium inline-block mv-0 text-heading">
                        <Link
                            className="no-underline"
                            to={slug}
                            onClick={() => click(title)}
                        >
                            {title}
                        </Link>
                    </h1>{' '}
                    <time className="inline-block text-muted">{date}</time>
                </header>
                <MDXRenderer>{body}</MDXRenderer>
            </article>
        </MDXProvider>
    )
}

export default Post