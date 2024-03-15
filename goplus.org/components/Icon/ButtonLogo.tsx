import React, { SVGProps } from 'react'


export default function ButtonLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <mask id="a" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="5" y="7" width="8" height="5">
                <path d="M5.25 7.5 9 11.25l3.75-3.75h-7.5Z" fill="#fff" />
            </mask>
            <g mask="url(#a)">
                <path fill="#5F6368" d="M18 0v18H0V0z" />
            </g>
        </svg>
    );
}