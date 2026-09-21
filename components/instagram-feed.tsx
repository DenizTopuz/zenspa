'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Post = {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  mediaUrl: string
  thumbnailUrl?: string | null
}

const INSTA_URL = 'https://instagram.com/cigdemzenspa'

const FALLBACK: Post[] = [
  { id: '1', mediaType: 'IMAGE', permalink: INSTA_URL, mediaUrl: '/hero.jpg' },
  { id: '2', mediaType: 'IMAGE', permalink: INSTA_URL, mediaUrl: '/hero.jpg' },
  { id: '3', mediaType: 'IMAGE', permalink: INSTA_URL, mediaUrl: '/bg-leaves.jpg' },
  { id: '4', mediaType: 'IMAGE', permalink: INSTA_URL, mediaUrl: '/hero.jpg' },
  { id: '5', mediaType: 'IMAGE', permalink: INSTA_URL, mediaUrl: '/bg-leaves.jpg' },
]

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK)

  useEffect(() => {
    const feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID
    if (!feedId) return

    fetch(`https://feeds.behold.so/${feedId}`)
      .then((r) => r.json())
      .then((data: Post[]) => {
        if (Array.isArray(data) && data.length >= 5) {
          setPosts(data.slice(0, 5))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
      {posts.map((post) => {
        const src =
          post.mediaType === 'VIDEO'
            ? (post.thumbnailUrl ?? '/hero.jpg')
            : post.mediaUrl
        const external = src.startsWith('http')

        return (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-3xl"
          >
            <Image
              src={src}
              alt=""
              fill
              aria-hidden
              unoptimized={external}
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </a>
        )
      })}
    </div>
  )
}
