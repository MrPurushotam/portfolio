'use client'

import { IconContext } from '@phosphor-icons/react'
import React from 'react'

const Provider = ({ children }) => {
    return (
        <>
            <IconContext.Provider
                value={{
                    size: 16,
                    weight: "duotone",
                    mirrored: false,
                }}>
                {children}
            </IconContext.Provider>
        </>
    )
}

export default Provider
