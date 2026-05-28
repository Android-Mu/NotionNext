/**import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'*/


const Footer = () => {
  return (
    <footer className='w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1a191d]'>
      <div className='mx-auto max-w-5xl px-6 py-8 text-sm leading-7 text-gray-500 dark:text-gray-400'>
        本站所收集资源均来自网盘用户公开分享，不做任何盈利，仅作个人公益学习，其网盘资源文件的有效性和安全性需自行判断，请勿非法，商业传播，如有侵权，请发邮件（yun12712@163.com）进行投诉，我们将在第一时间删除对应资源和相关文章！
      </div>
    </footer>
  )
}


/**
 * 站点也叫
 * @param {*} param0
 * @returns
 */
/**const Footer = ({ siteInfo }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='z-20 border p-2 rounded-lg bg:white dark:border-black dark:bg-hexo-black-gray justify-center text-center w-full text-sm relative'>
      <SocialButton />

      <div className='flex justify-center'>
        <div>
          <i className='mx-1 animate-pulse fas fa-heart' />{' '}
          <a
            href={siteConfig('LINK')}
            className='underline font-bold text-gray-500 dark:text-gray-300 '>
            {siteConfig('AUTHOR')}
          </a>
          .<br />
        </div>
        © {`${copyrightDate}`}
      </div>

      {siteConfig('BEI_AN') && (
        <>
          <i className='fas fa-shield-alt' />{' '}
          <a href={siteConfig('BEI_AN_LINK')} className='mr-2'>
            {siteConfig('BEI_AN')}
          </a>
          <BeiAnGongAn />
          <br />
        </>
      )}

      <span className='hidden busuanzi_container_site_pv'>
        <i className='fas fa-eye' />
        <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
      </span>
      <span className='pl-2 hidden busuanzi_container_site_uv'>
        <i className='fas fa-users' />{' '}
        <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
      </span>
      <div className='text-xs font-serif'>
        Powered By{' '}
        <a
          href='https://github.com/tangly1024/NotionNext'
          className='underline text-gray-500 dark:text-gray-300'>
          NotionNext {siteConfig('VERSION')}
        </a>
      </div>*/
      {/* SEO title */}
      /**<h1 className='pt-1 hidden'>{siteConfig('TITLE')}</h1>
    </footer>
  )
}*/

export default Footer
