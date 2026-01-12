import { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M24 4.17188L41.3281 24L24 43.8281L6.67188 24L24 4.17188Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M32.5 15.5L15.5 32.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M32.5 32.5L15.5 15.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
