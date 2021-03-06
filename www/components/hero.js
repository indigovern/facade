// @flow

import classNames from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import {graphql} from 'react-apollo'
import OpenMobileMenuIcon from 'react-icons/lib/io/navicon'

import HeroNavMenu from '../components/hero-nav-menu'
import HeroQuickLink from '../components/hero-quick-link'
import HeroSearch from '../components/hero-search'
import {themeId} from '../lib/theme'

const navHeight = 38 // px

export type Props = {
  data: {
    categories?: {
      edges: Array<{
        node: {
          id: string,
          link: string,
          name: string
        }
      }>
    },
    quickLinks?: {
      edges: Array<{
        node: {
          id: string,
          title: string,
          link: string,
          icon: string
        }
      }>
    },
    theme?: {
      fullName: ?string,
      heroImage: ?string,
      heroImageTint: ?(0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90),
      primaryMenu: ?string
    }
  },
  description?: string,
  showQuickLinks?: boolean,
  showSearch?: boolean,
  title?: string
}

type Context = {
  customized?: {
    full_name?: string,
    hero_image?: string,
    hero_image_tint?: number
  },
  openMobileMenu: any => any,
}

const Hero = ({data: {categories, quickLinks, theme}, description, showQuickLinks, showSearch, title}: Props, {customized, openMobileMenu}: Context) => {
  const customizedFullName = customized && customized.full_name
  const customizedHeroImage = customized && customized.hero_image
  const customizedHeroImageTint = customized && customized.hero_image_tint

  const quickLinksEdges = quickLinks && quickLinks.edges

  return (
    <section className='bg-dark-gray white relative cover bg-top'>
      <div
        className={classNames(
          'absolute top-0 bottom-0 left-0 right-0',
          `bg-black-${customizedHeroImageTint || (theme && theme.heroImageTint) || '0'}`
        )}
      />

      <div className='container relative'>
        <nav className='cf pt3'>
          <div className='fl w-70 w-30-ns h-100'>
            <a
              className='white b f4 no-underline nav-lh nowrap'
              href='/'
            >
              {customizedFullName || (theme && theme.fullName) || 'Name'}
            </a>
          </div>
          <div className='fl w-30 w-70-ns tr h-100'>
            <div className='dn dib-l h-100 nav-lh'>
              <HeroNavMenu html={theme && theme.primaryMenu} />
            </div>
            <div className='dn-l h-100 relative'>
              <a
                className='white dib v-center absolute right-0'
                href='javascript:void(0)'
                onClick={openMobileMenu}
              >
                <OpenMobileMenuIcon size={navHeight} />
              </a>
            </div>
          </div>
        </nav>

        <div className='tc pv4 pv5-l'>
          <div className='f3 f2-m f1-l f-title'>
            {title || 'Have a question? Let me help.'}
          </div>
          {description !== false && (
            <div className='mv3'>
              {description || 'Type your question below to get an immediate response from my team office.'}
            </div>
          )}
          {showSearch !== false && <HeroSearch />}
        </div>

        {showQuickLinks && quickLinksEdges && quickLinksEdges.length ? (
          <div className='pb5'>
            <div className='tc b mb3'>{'Quick Links'}</div>
            <div className='cf'>
              {quickLinksEdges.map(({node}) => (
                <div
                  className='fl w-50 w-third-m w-25-l'
                  key={node.id}
                >
                  <HeroQuickLink {...node} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        nav { height: ${navHeight}px }
        .nav-lh { line-height: ${navHeight}px }
        section { background-image: url(${customizedHeroImage || (theme && theme.heroImage) || ''}) }
      `}</style>
    </section>
  )
}

Hero.contextTypes = {
  customized: PropTypes.object,
  openMobileMenu: PropTypes.func
}

Hero.displayName = 'Hero'

export default graphql(gql(`
  query {
    quickLinks {
      edges {
        node {
          id
          title
          link
          icon
        }
      }
    }
    theme (id: "${themeId}") {
      fullName
      heroImage
      heroImageTint
      primaryMenu
    }
  }
`))(Hero)
