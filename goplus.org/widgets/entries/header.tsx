import React from 'react'
import Header from 'components/Header'
import { defineWidget } from '../widget'

/**
 * Usage:
 * 
 * ```html
 * <goplus-header>
 *   <div style="height: 72px;"><!-- placeholder --></div>
 * </goplus-header>
 * ```
 */

defineWidget('header', () => <Header />)
