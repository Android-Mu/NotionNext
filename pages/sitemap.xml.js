// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'

const SECTION_PAGE_SLUGS = new Set([
  'toolsweb',
  'music',
  'template',
  'study',
  'software',
  'aigc'
])

const EXCLUDED_SLUGS = new Set([
  'home',
  'archive',
  'category',
  'search',
  'tag',
  'rss/feed.xml'
])

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    const siteData = await fetchGlobalAllData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const localeFields = generateLocalesSitemap(link, siteData.allPages, locale)
    fields = fields.concat(localeFields)
  }

  fields = getUniqueFields(fields)

  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(link, allPages, locale) {
  const baseUrl = normalizeBaseUrl(link)
  const localePrefix = normalizeLocalePrefix(locale)
  const dateNow = formatDate(new Date())

  const defaultFields = [
    {
      loc: `${baseUrl}${localePrefix}/`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '1.0'
    }
  ]

  const postFields =
    allPages
      ?.filter(isIndexablePage)
      ?.map(post => {
        const slug = normalizeSlug(post.slug)
        return {
          loc: `${baseUrl}${localePrefix}/${slug}`,
          lastmod: getLastmod(post, dateNow),
          changefreq: getChangefreq(slug),
          priority: getPriority(slug)
        }
      }) ?? []

  return defaultFields.concat(postFields)
}

function normalizeBaseUrl(link = '') {
  return link.endsWith('/') ? link.slice(0, -1) : link
}

function normalizeLocalePrefix(locale = '') {
  if (!locale) {
    return ''
  }

  return locale.startsWith('/') ? locale : `/${locale}`
}

function normalizeSlug(slug = '') {
  return slug.startsWith('/') ? slug.slice(1) : slug
}

function isIndexablePage(page) {
  if (page?.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) {
    return false
  }

  const slug = normalizeSlug(page?.slug)
  if (!slug || EXCLUDED_SLUGS.has(slug)) {
    return false
  }

  if (/^(https?:|mailto:|tel:)/i.test(slug)) {
    return false
  }

  if (slug.includes('://') || slug.includes('?') || slug.includes('#')) {
    return false
  }

  return true
}

function getLastmod(post, fallbackDate) {
  const date = post?.lastEditedDate || post?.publishDay
  return formatDate(date) || fallbackDate
}

function formatDate(date) {
  const timestamp = new Date(date)
  if (Number.isNaN(timestamp.getTime())) {
    return ''
  }

  return timestamp.toISOString().split('T')[0]
}

function getChangefreq(slug) {
  if (SECTION_PAGE_SLUGS.has(slug)) {
    return 'weekly'
  }

  return 'daily'
}

function getPriority(slug) {
  if (SECTION_PAGE_SLUGS.has(slug)) {
    return '0.8'
  }

  return '0.6'
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    const loc = field.loc.replace(/([^:]\/)(\/+)/g, '$1')
    const existingField = uniqueFieldsMap.get(loc)

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(loc, { ...field, loc })
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

export default () => {}
