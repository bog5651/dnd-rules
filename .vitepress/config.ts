import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import path from 'path';
import { SitemapStream } from 'sitemap';
import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

const links: { url: string; lastmod?: number }[] = [];

export default defineConfig({
  title: 'DND Docs',
  description: 'Example',
  titleTemplate: false,
  srcDir: 'src',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: {
      '/rules/': {
        base: '/rules/',
        items: [
          {
            text: 'Get Started',
            collapsed: true,
            items: [
              { text: 'Introduction', link: 'introduction' },
            ]
          }
        ]
      }
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    }
  },
  head: [
    ['link', { rel: 'manifest', href: 'site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'image_src', type: 'image/png', href: '/images/social.png' }]
  ],
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      });
  },
  vite: {
    plugins: [
      llmstxt(),
      {
        name: 'disable-vp-static-data-plugin',
        configResolved(config) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config.plugins.splice(
            config.plugins.findIndex((p) => p.name === 'vitepress:data'),
            1
          );
        }
      }
    ],
    resolve: {
      alias: [
        {
          find: /^.*\/VPFeature\.vue$/,
          replacement: path
            .resolve(__dirname, './theme/components/HHFeature.vue')
            .replaceAll(path.sep, '/')
          // fileURLToPath(
          //   new URL('./theme/components/HHFeature.vue', import.meta.url)
          // )
        }
      ]
    }
  }
});
