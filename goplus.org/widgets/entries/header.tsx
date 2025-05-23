import React from 'react'
import Header from 'components/Header'
import { defineWidget } from '../widget'

/**
 * Usage:
 * 
 * ```html
 * <xgo-header>
 *   <div style="height: 72px;"><!-- placeholder --></div>
 * </xgo-header>
 * ```
 */

defineWidget('header', () => <Header />)
